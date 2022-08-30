import { AsyncResponseResolverReturnType, MockedResponse, ResponseComposition, rest, RestContext, RestRequest } from 'msw';
import { createStore, get, set } from 'idb-keyval';
import type { UseStore } from 'idb-keyval';
import { buildTokenFields } from './build-token-fields';
import { buildUserFields } from './build-user-fields';
import { createAsyncQueue } from '@crux/async-queue';
import type { Token, User } from '../types';

type Users = Record<string, User>;
type Tokens = Record<string, Token>;
type ConfirmationTokens = Record<string, string>;

export async function createMocks(dbName: string, apiBaseUrl: string) {
  const store = createStore(dbName, 'mock-server');

  if (!(await get('users', store))) {
    await set('users', {}, store);
  }

  if (!(await get('tokens', store))) {
    await set('tokens', {}, store);
  }

  if (!(await get('confirmation-tokens', store))) {
    await set('confirmation-tokens', {}, store);
  }
  
  const queue = createAsyncQueue();

  // Create a handler that is added to the async queue when called. This ensures that if requests are made while
  // another one is being handled, the reads and writes to the store are sequential.
  const queuedHandler = (handler: (req: RestRequest, res: ResponseComposition, ctx: RestContext, s: UseStore) => void) => {
    return function handle(req: RestRequest, res: ResponseComposition, ctx: RestContext) {
      console.log('handling');
      const returnPromise = queue.add(handler, req, res, ctx, store) as AsyncResponseResolverReturnType<MockedResponse<any>>;
      
      queue.flush();

      return returnPromise;
    }
  }

  return [
    /**
     * Login/Refresh token.
     */
    rest.post(`${apiBaseUrl}/auth/v1/token`, queuedHandler(token)),

    /**
     * Signup.
     */
    rest.post(`${apiBaseUrl}/auth/v1/signup`, queuedHandler(signup)),

    /**
     * User.
     */
    rest.get(`${apiBaseUrl}/auth/v1/user`, queuedHandler(user)),

    /**
     * Verify.
     */
    rest.get(`${apiBaseUrl}/auth/v1/verify`, queuedHandler(verify)),
  ];
}

/**
 * Login/refresh token
 */
async function token(req: RestRequest, res: ResponseComposition, ctx: RestContext, store: UseStore) {
  const { searchParams } = req.url;

  const grantType = searchParams.get('grant_type');

  if (grantType === 'password') {
    return login(req, res, ctx, store);
  }

  return refreshToken(req, res, ctx, store);
}

/**
 * Login.
 */
async function login(req: RestRequest, res: ResponseComposition, ctx: RestContext, store: UseStore) {
  const { params: { email, password } } = req as any;
  const users = await get('users', store) as Users;
  const tokens = await get('tokens', store) as Tokens;
  const confirmationTokens = await get('confirmation-tokens', store) as ConfirmationTokens;

  const currentEntry = users[email];

  if (!currentEntry || !password) {
    return res(
      ctx.json({
        "error": "invalid_grant",
        "error_description": "Invalid login credentials"
      }),
      ctx.status(400, 'Bad Request')
    );
  }

  if (!confirmationTokens[email]) {
    return res(
      ctx.json({
        "error": "invalid_grant",
        "error_description": "Email not confirmed"
      }),
      ctx.status(400, 'Bad Request')
    )
  }

  tokens[email] = buildTokenFields();

  await set('tokens', tokens, store);

  return res(
    ctx.json({
      ...tokens[email],
      user: users[email],
    }),
    ctx.status(200),
  )
}

/**
 * Refresh Token.
 */
async function refreshToken(req: RestRequest, res: ResponseComposition, ctx: RestContext, store: UseStore) {
  const { params } = req as any;

  const users = await get('users', store) as Users;
  const tokens = await get('tokens', store) as Tokens;

  // Get the email from the token
  const email = Object.entries(tokens).find(([key, value]) => {
    return value.refresh_token === params.refresh_token;
  })?.[0];

  if (!email) {
    return res(
      ctx.json({
        "error": "invalid_grant",
        "error_description": "Invalid Refresh Token"
    }),
      ctx.status(400, 'Bad Request')
    );
  }

  if (!users[email]) {
    return res();
  }

  tokens[email] = buildTokenFields();

  await set('tokens', tokens, store);

  return res(
    ctx.json({
      ...tokens[email],
      user: users[email],
    }),
    ctx.status(200),
  )
}

/**
 * Signup.
 */
async function signup(req: RestRequest, res: ResponseComposition, ctx: RestContext, store: UseStore) {
  const { params: { email, password } } = req as any;

  if (!email || !password) {
    return res(
      ctx.json({
        "code": 422,
        // Password message takes precedence
        "msg": !password ? "Signup requires a valid password" : "To signup, please provide your email"
      }),
        ctx.status(422, 'Unprocessable Entity'),
      );
  }

  const users = await get('users', store) as Users;
  const tokens = await get('tokens', store) as Tokens;

  const currentUser = users[email];

  const newUser = buildUserFields(email as string);
  const newToken = buildTokenFields();

  // Supabase sends fake data for users that already exist, without creating a database entry.
  if (currentUser) {
    return res(
      ctx.json(newUser),
      ctx.status(200)
    )
  }

  users[email] = newUser;
  tokens[email] = newToken;

  await set('users', users, store);
  await set('tokens', tokens, store);

  return res(
    ctx.json(newUser),
    ctx.status(200),
  )
}

/**
 * User.
 */
async function user(req: RestRequest, res: ResponseComposition, ctx: RestContext, store: UseStore) {
  const { headers } = req;
  const token = headers.get('Authorization')?.split(' ')[1];

  const users = await get('users', store) as Users;
  const tokens = await get('tokens', store) as Tokens;

  // Get the email from the token
  const email = Object.entries(tokens).find(([key, value]) => {
    return value.access_token === token;
  })?.[0];

  if (!email) {
    return res(
      ctx.json({
        "code": 401,
        "msg": "Invalid token"
      }),
      ctx.status(401),
    )
  }

  const currentUser = users[email];

  return res(
    ctx.json(currentUser),
    ctx.status(200),
  );
}

/**
 * Verify.
 */
async function verify(req: RestRequest, res: ResponseComposition, ctx: RestContext, store: UseStore) {
  const { searchParams } = req.url;

  const { headers } = req;
  const token = headers.get('Authorization')?.split(' ')[1];

  const users = await get('users', store) as Users;
  const confirmationTokens = await get('confirmation-tokens', store) as ConfirmationTokens;

  // Get the email from the token
  const email = Object.entries(confirmationTokens).find(([key, confirmationToken]) => {
    return confirmationToken === searchParams.get('token');
  })?.[0];

  if (!email) {
    return;
  }

  users[email].confirmation_sent_at = (new Date()).toISOString();
  delete confirmationTokens[email];

  await set('users', users, store);
  await set('confirmation-tokens', confirmationTokens, store);
}
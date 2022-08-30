## Sign-up

Request:
```bash
'https://qanypknscdifnekwqetv.supabase.co/auth/v1/signup' \
-H "apikey: SUPABASE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "someone@email.com",
  "password": "lxsrxnEzNHeAfMsJUkwK"
}'
```

Response:
```json
{
    "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "andrewdjessop@protonmail.com",
    "phone": "",
    "confirmation_sent_at": "2022-08-28T17:52:39.269845078Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {},
    "identities": [
        {
            "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
            "user_id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
            "identity_data": {
                "sub": "25168f7a-7ba1-4bbf-80bc-40ddef10db83"
            },
            "provider": "email",
            "last_sign_in_at": "2022-08-28T17:52:39.267329898Z",
            "created_at": "2022-08-28T17:52:39.267376Z",
            "updated_at": "2022-08-28T17:52:39.26738Z"
        }
    ],
    "created_at": "2022-08-28T17:52:39.262688Z",
    "updated_at": "2022-08-28T17:52:40.556283Z"
}
```

## Login

Request:

```bash
'https://qanypknscdifnekwqetv.supabase.co/auth/v1/token?grant_type=password' \
-H "apikey: SUPABASE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "someone@email.com",
  "password": "lxsrxnEzNHeAfMsJUkwK"
}'
```

Response:

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjYxNzEyODkxLCJzdWIiOiIyNTE2OGY3YS03YmExLTRiYmYtODBiYy00MGRkZWYxMGRiODMiLCJlbWFpbCI6ImFuZHJld2RqZXNzb3BAcHJvdG9ubWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.gnANfz1MyfHXqgesLsDPfthnmKH0aefzo2y6WuIF1yc",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "cQ3HhmJGb44jlz1vsdk3_Q",
    "user": {
        "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
        "aud": "authenticated",
        "role": "authenticated",
        "email": "andrewdjessop@protonmail.com",
        "email_confirmed_at": "2022-08-28T17:54:43.144594Z",
        "phone": "",
        "confirmation_sent_at": "2022-08-28T17:52:39.269845Z",
        "confirmed_at": "2022-08-28T17:54:43.144594Z",
        "last_sign_in_at": "2022-08-28T17:54:51.981617436Z",
        "app_metadata": {
            "provider": "email",
            "providers": [
                "email"
            ]
        },
        "user_metadata": {},
        "identities": [
            {
                "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
                "user_id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
                "identity_data": {
                    "sub": "25168f7a-7ba1-4bbf-80bc-40ddef10db83"
                },
                "provider": "email",
                "last_sign_in_at": "2022-08-28T17:52:39.267329Z",
                "created_at": "2022-08-28T17:52:39.267376Z",
                "updated_at": "2022-08-28T17:52:39.26738Z"
            }
        ],
        "created_at": "2022-08-28T17:52:39.262688Z",
        "updated_at": "2022-08-28T17:54:51.982871Z"
    }
}
```

## Logout


```bash
'https://qanypknscdifnekwqetv.supabase.co/auth/v1/logout' \
-H "apikey: SUPABASE_KEY" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer USER_TOKEN"'
```

## User

```bash
'https://qanypknscdifnekwqetv.supabase.co/auth/v1/user' \
-H "apikey: SUPABASE_KEY" \
-H "Authorization: Bearer USER_TOKEN"
```

Response:

```json
{
    "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "andrewdjessop@protonmail.com",
    "email_confirmed_at": "2022-08-28T17:54:43.144594Z",
    "phone": "",
    "confirmation_sent_at": "2022-08-28T17:52:39.269845Z",
    "confirmed_at": "2022-08-28T17:54:43.144594Z",
    "last_sign_in_at": "2022-08-28T17:54:51.981617Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {},
    "identities": [
        {
            "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
            "user_id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
            "identity_data": {
                "sub": "25168f7a-7ba1-4bbf-80bc-40ddef10db83"
            },
            "provider": "email",
            "last_sign_in_at": "2022-08-28T17:52:39.267329Z",
            "created_at": "2022-08-28T17:52:39.267376Z",
            "updated_at": "2022-08-28T17:52:39.26738Z"
        }
    ],
    "created_at": "2022-08-28T17:52:39.262688Z",
    "updated_at": "2022-08-28T17:54:51.982871Z"
}
```

### Update User

```bash
'https://qanypknscdifnekwqetv.supabase.co/auth/v1/user' \
-H "apikey: SUPABASE_KEY" \
-H "Authorization: Bearer <USERS-ACCESS-TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "email": "someone@email.com",
  "password": "new-password",
  "data": {
    "key": "value"
  }
}'
```

```json
{
    "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "andrewdjessop@protonmail.com",
    "email_confirmed_at": "2022-08-28T17:54:43.144594Z",
    "phone": "",
    "confirmation_sent_at": "2022-08-28T17:52:39.269845Z",
    "confirmed_at": "2022-08-28T17:54:43.144594Z",
    "last_sign_in_at": "2022-08-28T17:54:51.981617Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {
        "key": "value"
    },
    "identities": [
        {
            "id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
            "user_id": "25168f7a-7ba1-4bbf-80bc-40ddef10db83",
            "identity_data": {
                "sub": "25168f7a-7ba1-4bbf-80bc-40ddef10db83"
            },
            "provider": "email",
            "last_sign_in_at": "2022-08-28T17:52:39.267329Z",
            "created_at": "2022-08-28T17:52:39.267376Z",
            "updated_at": "2022-08-28T17:52:39.26738Z"
        }
    ],
    "created_at": "2022-08-28T17:52:39.262688Z",
    "updated_at": "2022-08-28T18:00:55.105249Z"
}
```
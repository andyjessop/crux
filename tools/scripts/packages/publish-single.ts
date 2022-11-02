import { config } from 'dotenv';
import { argv } from 'process';
import npmPublish from '@jsdevtools/npm-publish';

config();

const projectName = argv[2];

publish(projectName);

export async function publish(name: string) {
  await npmPublish({
    access: 'public',
    package: `dist/packages/${name}/package.json`,
    token: process.env.NPM_ACCESS_TOKEN,
  });
}

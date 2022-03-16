import { Tree, formatFiles, generateFiles, joinPathFragments, names } from '@nrwl/devkit';
import { ComponentSchema } from './schema';

export default async function (tree: Tree, schema: ComponentSchema) {
  const {
    name, path, 
  } = schema;

  const middlewareNames = names(name);

  generateFiles(
    // virtual file system
    tree,

    // the location where the template files are
    joinPathFragments(__dirname, './files'),

    // where the files should be generated
    path || `./packages/dev/src/app/middleware/${name}`,

    // the variables to be substituted in the template
    {
      // remove __tmpl__ from file endings
      tmpl: '',
      filename: middlewareNames.className,
      names: middlewareNames,
    }
  );

  await formatFiles(tree);
}
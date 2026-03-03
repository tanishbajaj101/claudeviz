import { CODE_JS } from 'files';

const languages = [{
  name: 'JavaScript',
  ext: 'js',
  mode: 'javascript',
  skeleton: CODE_JS,
}];

const exts = languages.map(language => language.ext);

export {
  languages,
  exts,
};

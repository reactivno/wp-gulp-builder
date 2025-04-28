import {
  deleteAsync
} from 'del';

const cleanBuildFolder = () => deleteAsync( [ '../assets/*' ], {
  force: true
} );

export default cleanBuildFolder;
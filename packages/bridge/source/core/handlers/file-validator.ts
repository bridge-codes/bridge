import { AbstractHandler, Handler } from '../handler';
import { httpError, StatusCode } from '../../error';

export type FilesConfig = 'any' | ReadonlyArray<string>;

export class FileValidator extends AbstractHandler {
  constructor(private config: FilesConfig) {
    super();
  }

  public handle: Handler['handle'] = async (data) => {
    const missingFiles: string[] = [];

    // req.body contains the files
    if (this.config !== 'any')
      for (const name of this.config) if (!data.files[name]) missingFiles.push(name);

    if (missingFiles.length > 0)
      return httpError(StatusCode.BAD_REQUEST, 'Files schema validation error', {
        missingFiles,
      });

    return super.handle(data);
  };
}

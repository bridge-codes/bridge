import { AbstractHandler, Handler } from '../handler';
import { httpError, StatusCode } from '../../error';

export type FileConfig = 'any' | ReadonlyArray<string>;

export class FileValidator extends AbstractHandler {
  constructor(private config: FileConfig) {
    super();
  }

  public handle: Handler['handle'] = async (data) => {
    const missingFiles: string[] = [];

    // req.body contains the files
    if (this.config !== 'any')
      for (const name of this.config) if (!data.file[name]) missingFiles.push(name);

    if (missingFiles.length > 0)
      return httpError(StatusCode.UNPROCESSABLE_ENTITY, "You didn't send all required files", {
        missingFiles,
      });

    return super.handle(data);
  };
}

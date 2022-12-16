import { FormidableFile } from '../../utilities';
import { IncomingMessage } from 'http';

export const formidableAsyncParseFiles = async (
  req: IncomingMessage,
  formidable: any,
): Promise<{
  [file: string]: FormidableFile | FormidableFile[];
}> => {
  let form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, function (error: any, fields: any, files: any) {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
};

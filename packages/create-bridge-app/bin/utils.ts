import childProcess from 'child_process';

export function runCommand({
  command,
  onSuccess,
  onFailure,
}: {
  command: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}): void {
  try {
    childProcess.exec(`${command}`, (error, stdout, stderr) => {
      // console.log(error, stdout, stderr);

      if (error) onFailure?.();
      else onSuccess?.();
    });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);

    onFailure?.();
  }
}

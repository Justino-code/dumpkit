// src/dump/renderer.ts

/**
 * Write formatted output to a stream
 * @param output - The formatted string to write
 * @param stream - Target stream (defaults to process.stderr)
 */
export function writeToStream(output: string, stream: NodeJS.WriteStream = process.stderr): void {
  // Add newline at the end for better readability
  const outputWithNewline = output.endsWith('\n') ? output : `${output}\n`;
  stream.write(outputWithNewline);
}
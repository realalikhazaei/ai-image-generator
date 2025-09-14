import logger from './logger.js';

const generateImage = async (prompt, model = 'flux') => {
  const body = JSON.stringify({ prompt, model });
  const headers = { 'Content-Type': 'application/json', Accept: 'text/event-stream' };

  const res = await fetch(`${process.env.API_BASE}/${process.env.API_GENERATE}`, {
    method: 'POST',
    body,
    headers,
  });

  let imageUrl;
  let error;

  const reader = res.body.pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        const lines = chunk.split('\n');
        const messages = lines.filter(line => line.startsWith('data: ')).map(line => JSON.parse(line.slice(6).trim()));

        messages.forEach(data => {
          switch (data.status) {
            case 'processing':
              logger.info(`Processing your request: ${data.message}`);
              break;

            case 'complete':
              imageUrl = data.imageUrl;
              logger.info(`Image URL: ${imageUrl}`);
              controller.terminate && controller.terminate();
              break;

            case 'error':
              error = data.message;
              logger.error(`Error: ${error}`);
              controller.terminate && controller.terminate();
              break;
          }
        });
      },
    })
  );

  const readerInstance = reader.getReader();

  try {
    while (true) {
      const { done } = await readerInstance.read();
      if (done) break;
    }
  } catch (error) {
    logger.error(`Error reading stream: ${error}`);
  } finally {
    readerInstance.releaseLock();
    return { imageUrl, error };
  }
};

export default generateImage;

import logger from '../utils/logger.js';
import generateImage from '../utils/generateImage.js';

export const getModels = async (req, res, next) => {
  logger.info('Get all models request...');

  const result = await fetch(`${process.env.API_BASE}/${process.env.API_MODELS}`);

  let { models } = await result?.json();

  models = models.filter(({ model }) => model !== 'default');

  if (!models) return next(new Error('AppError: There has been a problem fetching models.'));

  res.status(200).json({
    status: 'success',
    data: { models },
  });
};

export const getImage = async (req, res, next) => {
  console.log(req.body);
  const { prompt, model = 'flux-schnell' } = req.body;

  if (!prompt) return next(new Error('AppError: Please provide a prompt.'));

  logger.info(`Generate image request... Model: ${model} - Prompt: ${prompt}`);

  const { imageUrl, error } = await generateImage(prompt, model);

  if (error) return next(new Error(`AppError: ${error}.\nPrompt:\n${prompt}\n\nModel:\n${model}`));

  res.status(201).json({
    status: 'success',
    data: { imageUrl },
  });
};

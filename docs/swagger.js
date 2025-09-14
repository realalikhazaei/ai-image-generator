import yaml from 'yamljs';

const swaggerDoc = yaml.load('./docs/swagger.yaml');

export default swaggerDoc;

/* eslint-disable */
async function getData() {
  const b = a + await getSessionStatusApi();
}
async function getApiData() {
  await getApiData();
}

async function getQuestionsData() {
  const c = b + await new Api().getQuestionsData();
}

async function getNormalData() {
  const c = await getData;
}

async function reduce(array, reducer, accumulator) {
  for (let i = 0; i < array.length; i++) {
    accumulator = await reducer(accumulator, array[i], i, array);
  }
  return accumulator;
}
async function testData() {
  await every([2, 3], async v => (await fetch(v)).ok);
}
const a = async function(req, res) {
  const tasks = await repository.get();
}

async function testReturnAwaitData() {
  return await getData();
}
// ObjectExpression
const CompaniesController = {
  verifySubDomain: async request => {
    const company = await Company.findOne({
      where: {
        id: request.params.id
      }
    });
  }
}

// single expression statement with no assignment to any variable
async function expressionStatement() {
  a + await getSessionStatusApi();
}

// class method with async await
class Abc extends React.Component {
  async componentDidMount() {
    const b = await getData();
  }
}

// async await inside a call expression as argument to a function
getData(async () => {
  await getData();
})

// jest and enzyme tests 
describe('<SessionForm />', async () => {
  let translatedText = await 'dummy translation';
})

describe('<SessionForm />', async function() {
  let translatedText = await 'dummy translation';
})

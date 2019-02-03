/* eslint-disable */
async function getData() {
  try {
    const b = a + await getSessionStatusApi();
  } catch (e) {
    console.log(e);
  }
}
async function getApiData() {
  try {
    await getApiData();
  } catch (e) {
    console.log(e);
  }
}

async function getQuestionsData() {
  try {
    const c = b + await new Api().getQuestionsData();
  } catch (e) {
    console.log(e);
  }
}

async function getNormalData() {
  try {
    const c = await getData;
  } catch (e) {
    console.log(e);
  }
}

async function reduce(array, reducer, accumulator) {
  for (let i = 0; i < array.length; i++) {
    try {
      accumulator = await reducer(accumulator, array[i], i, array);
    } catch (e) {
      console.log(e);
    }
  }
  return accumulator;
}
async function testData() {
  try {
    await every([2, 3], async v => (await fetch(v)).ok);
  } catch (e) {
    console.log(e);
  }
}
const a = async function(req, res) {
  try {
    const tasks = await repository.get();
  } catch (e) {
    console.log(e);
  }
}

async function testReturnAwaitData() {
  try {
    return await getData();
  } catch (e) {
    console.log(e);
  }
}
// ObjectExpression
const CompaniesController = {
  verifySubDomain: async request => {
    try {
      const company = await Company.findOne({
        where: {
          id: request.params.id
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

// single expression statement with no assignment to any variable
async function expressionStatement() {
  try {
    a + await getSessionStatusApi();
  } catch (e) {
    console.log(e);
  }
}

// class method with async await
class Abc extends React.Component {
  async componentDidMount() {
    try {
      const b = await getData();
    } catch (e) {
      console.log(e);
    }
  }
}

// async await inside a call expression as argument to a function
getData(async () => {
  try {
    await getData();
  } catch (e) {
    console.log(e);
  }
})

// jest and enzyme tests 
describe('<SessionForm />', async () => {
  try {
    let translatedText = await 'dummy translation';
  } catch (e) {
    console.log(e);
  }
})

describe('<SessionForm />', async function() {
  try {
    let translatedText = await 'dummy translation';
  } catch (e) {
    console.log(e);
  }
})


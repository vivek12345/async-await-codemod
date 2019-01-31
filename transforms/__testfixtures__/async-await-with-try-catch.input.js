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
};

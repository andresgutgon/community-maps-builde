import '@testing-library/jest-dom/extend-expect'

global.fetchMock = (data) => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(data)
      })
    })
}

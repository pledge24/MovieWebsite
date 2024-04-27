const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: ${{secrets.API_KEY}}
    }
  };

export default options;

import rp from 'request-promise';

const reqisterMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path,
    message
  }
}
`

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path,
    message
  }
}
`

const meQuery = `
query {
  me {
    userId
    email
  }
}
`;

const logoutMutation = `
mutation {
  logout {
    path
    message
  }
}`


export class RequestManager {
  private url: string = "";
  private options: {
    withCredentials: boolean;
    json: boolean;
    jar: any
  }

  constructor(url: string) {
    this.url = url;
    this.options = {
      withCredentials: true,
      json: true,
      jar: rp.jar()
    }
  }

  public register = async (email: string, password: string) => {
    const response = await rp.post(this.url, {
      body: {
        query: reqisterMutation(email, password)
      },
      ...this.options
    });
    return response;
  }

  public login = async (email: string, password: string) => {
    const response = await rp.post(this.url, {
      body: {
        query: loginMutation(email, password)
      },
      ...this.options
    })
    return response;
  }

  public me = async () => {
    const response = await rp.post(this.url, {
      body: {
        query: meQuery
      },
      ...this.options
    });
    return response;
  }

  public logout = async () => {
    const response = await rp.post(this.url, {
      body: {
        query: logoutMutation
      },
      ...this.options
    });
    return response;
  }
}
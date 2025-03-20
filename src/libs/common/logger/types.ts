export interface HttpErrorLog {
    contextType: 'http'
    statusCode: number
    request: { method: string; url: string; body: any }
    response: object | string
    stack?: string
}

export interface HttpSuccessLog {
    contextType: 'http'
    statusCode: number
    request: { method: string; url: string; body: any }
    duration: string
}

export interface RpcErrorLog {
    contextType: 'rpc'
    context: any
    data: any
    response: object | string
    stack?: string
}

export interface RpcSuccessLog {
    contextType: 'rpc'
    context: any
    data: any
    duration: string
}

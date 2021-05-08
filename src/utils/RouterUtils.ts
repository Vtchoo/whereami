interface QueryObject {
    [key: string]: string
}

class RouterUtils {

    static parseQuery(query: string) {
        
        const raw = query.startsWith('?') ? query.replace('?', '') : query

        const obj = raw
            .split('&')
            .reduce((obj, curr) => {
                const [key, value] = curr.split('=')
                obj[key] = value
                return obj
            }, {} as QueryObject)
        
        return obj
    }
}

export default RouterUtils

import _ from 'lodash'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { JwtPayload } from './types'
dotenv.config()

const camelcasify = (_res: any, array: boolean = false) => {
    const { rows } = _res

    if (array) {
        return rows.map((row: any) => _.mapKeys(row, (_v, k) => _.camelCase(k)))
    } else {
        const row = _.first(rows)

        if (row) {
            return _.mapKeys(row as any, (_v, k) => _.camelCase(k))
        }
        return row
    }
}

const verifyJWT = async (token: string) => {
    return (await jwt.verify(
        token,
        process.env.JWT_SECRET as string
    )) as JwtPayload
}

export { camelcasify, verifyJWT }

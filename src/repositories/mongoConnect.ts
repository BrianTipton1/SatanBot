import { inject, injectable } from 'inversify';
import { connect, connection, Connection } from 'mongoose';
import { TYPES } from '../types';

@injectable()
class MongoAcesss {
    private mongooseInstance: any;
    private mongooseConnection: Connection;
    private connectionstr: string;
    constructor(@inject(TYPES.MongoConnectionString) private connection: string) {
        this.connectionstr = connection;
    }

    public connect(): Connection {
        let options = {};
        this.mongooseConnection = connection;
        this.mongooseConnection
            .once('open', () => {
                console.log('info: ', 'Connected to MongoDB');
            })
            .on('error', function (error) {
                console.log('error: ', 'Mongo connection error: ' + error);
                throw error;
            });
        options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        this.mongooseInstance = connect(this.connectionstr, options);
        return this.mongooseInstance;
    }
}
export default MongoAcesss;

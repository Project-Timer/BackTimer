module.exports = class Service {
    constructor(Model) {
        this.model = Model
        this.getAll = this.getAll.bind(this);
        this.findOne = this.findOne.bind(this)
        this.save = this.save.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(query) {
    }

    /**
     *  @return {Object} result
     *  @param params
     * */
    async findOne(params) {
        console.log(params)
        return new Promise((resolve, reject) => {
            this.model.findOne(params, (error, userModel) => {
                if (error) {
                    reject({
                        error: true,
                        statusCode: 500,
                        errors: "Server Error"
                    });
                } else {
                    resolve({
                        error: false,
                        statusCode: 200,
                        data: userModel
                    });
                }
            })
        });
    }

    async save(params) {
        return new Promise((resolve, reject) => {
            params.save((error) => {
                if (error) reject({
                    error: true,
                    statusCode: 500,
                    errors: error});
            })
            resolve({
                error: false,
                statusCode: 200
            });
        })
    }

    async update(id, data) {
    }

    async delete(id) {
    }
}
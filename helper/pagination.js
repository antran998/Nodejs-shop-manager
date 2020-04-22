const {Op} = require('sequelize');

class Pagination {
    constructor(Model, currPage, searchField, searchValue, orderField, orderDir,optionField,optionValue) {
        this.Model = Model;
        this.currPage = currPage;
        this.searchField = searchField;
        this.searchValue = searchValue;
        this.orderField = orderField;
        this.orderDir = orderDir;
        this.optionField = optionField;
        this.optionValue = optionValue;
    }

    async returnData() {
        const pageSize = 5;
        const skip = (this.currPage-1) * pageSize; 
        
        const statement = {};
        statement[this.searchField] = { [Op.substring]: this.searchValue };
        if(this.optionField != '0') {
            statement[this.optionField] = { [Op.substring]: this.optionValue };
        }
        
        try {
            const data = await this.Model.findAll({
                where: statement,
                order: [[this.orderField, this.orderDir.toUpperCase()]],
                offset: skip,
                limit: pageSize,
            });            
            
            const total = await this.Model.count({ where: statement });
            const totalPage = Math.ceil(total / pageSize);

            return {
                data: data,
                currPage: this.currPage,
                totalPage: totalPage,
            };
        } catch (err) {
            console.log(err);
        }        
    }
}

module.exports = Pagination;
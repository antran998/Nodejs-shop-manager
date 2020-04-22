const {Op} = require('sequelize');
const Helper = require('./helpful-function');

class DataTable {
    constructor(Model,draw,start,length,sortColumn,sortDirection,searchValue){
        this.Model = Model;
        this.draw = draw;
        this.start = start;
        this.length = length;
        this.sortColumn = sortColumn;
        this.sortDirection = sortDirection;
        this.searchValue = searchValue;
    }

    async returnData() {
        const pageSize = this.length != null ? parseInt(this.length) : 0;        
        const skip = this.start != null ? parseInt(this.start) : 0;
        let recordsTotal = 0;

        let singleModel = await this.Model.findOne({where:{id:{[Op.gt]:0}}}, {plain: true});
        singleModel = Helper.ConvertToPlain(singleModel);
        
        const searchFilter = {};
        for( const property in singleModel ) {
            searchFilter[property] = {[Op.substring]: this.searchValue};
        }
        let data = await this.Model.findAll({
            where: {
                [Op.or]: searchFilter,                
            },
            order: [[this.sortColumn,this.sortDirection.toUpperCase()]],
            offset: parseInt(skip),
            limit: parseInt(pageSize)
        });
        data = Helper.ConvertToPlain(data);
        
        recordsTotal = await this.Model.count();
        return {
            draw: parseInt(this.draw),
            recordsFiltered: recordsTotal,
            recordsTotal: recordsTotal,
            data: data,
        };
    }
}

module.exports = DataTable;
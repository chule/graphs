import _ from 'lodash'
import crossfilter from 'crossfilter'
 
function randomGaussian() {
    return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

const store = (() => {
    const data = _.range(256).map((i) => {
        // console.log(i, " -- ", randomGaussian() + 8);
        return [i, randomGaussian() + 8]
    });

    // console.log("data -> ", data);

    // Initialize crossfilter dataset.
    const filter = crossfilter(data);

    // Create dimensions and groups.
    const index = filter.dimension(d => d[0]);
    const indexGroup = index.group().reduceSum(d => d[1]);
    const value = filter.dimension(d => d[1]);
    const valueGroup = value.group().reduceSum(d => d[1]);
    const index2D = filter.dimension(d => d);
    const index2DGroup = index2D.group();

    const charts = [];

    return {
        data,
        filter,
        index, indexGroup,
        value, valueGroup,
        index2D, index2DGroup,
        charts
    };
})();

export default store
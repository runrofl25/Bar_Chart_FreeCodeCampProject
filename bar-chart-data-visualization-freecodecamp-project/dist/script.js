//1. Get data from API
//2. find a good width for the bars
//3. maybe change the width of the svg to make sure the bars fit
//4. enjoy
//5. scale the heights of the bar so they fit


// dummy data

const tooltip = document.getElementById('tooltip');
// const dummy = [
//     [
//       "1947-01-01",
//       243.1
//     ],
//     [
//       "1947-04-01",
//       246.3
//     ],
//     [
//       "1947-07-01",
//       250.1
//     ],
//     [
//       "1947-10-01",
//       260.3
//     ],
//     [
//       "1948-01-01",
//       266.2
//     ],
//     [
//       "1948-04-01",
//       272.9
//     ],
//     [
//       "1948-07-01",
//       279.5
//     ]]

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(res => res.json()).
then(res => {
  const { data } = res;

  createStuff(data.map(d => [d[0], d[1]]));
  //const string = '2010-01-01'
});

// const mapping = {
//   '01': 0,
//   '04': 0.25,
//   '07': 0.5,
//   '10': 0.75
// }

// function convertDateToYear(dateStr){
//   const splitted = dateStr.split('-');
//   const year = splitted[0];
//   const month = splitted[1];
//   return +year + mapping[month];
// }

function createStuff(data) {
  const width = 800;
  const height = 400;
  const padding = 40;

  const barWidth = width / data.length;


  // const scale = d3.scaleLinear()
  // .domain([0, d3.max(data, d=> d[1])])
  // .range([0, height]);

  const yScale = d3.scaleLinear().
  domain([0, d3.max(data, d => d[1])]).
  range([height - padding, padding]);


  // const xScale = d3.scaleLinear()
  // .domain([d3.min(data, d => d[2], d3.max(data, d => d[2]))])
  // .range([padding, width - padding])

  const xScale = d3.scaleTime().
  domain([d3.min(data, d => new Date(d[0])), d3.max(data, d => new Date(d[0]))]).
  range([padding, width - padding]);

  const svg = d3.select('#container').append('svg').
  attr('width', width).
  attr('height', height);

  // const arr= [];

  svg.selectAll('rect').
  data(data).
  enter().
  append('rect').
  attr('class', 'bar').
  attr('data-date', d => d[0]).
  attr('data-gdp', d => d[1]).
  attr('x', d => xScale(new Date(d[0]))) // changed to enable new date data to show on graph important
  .attr('y', d => yScale(d[1]))
  //.attr('x', (d, i) => i * barWidth)
  //.attr('y', d=> height - yScale(d[1]))
  .attr('width', barWidth).
  attr('height', d => height - yScale(d[1]) - padding).
  on('mouseover', (d, i) => {

    tooltip.classList.add('show');
    tooltip.style.left = i * barWidth + padding * 2 + 'px';
    tooltip.style.top = height - padding * 4 + 'px';
    tooltip.setAttribute('data-date', d[0]);

    tooltip.innerHTML = `
        <small>${d[0]}</small>
        $${d[1]} billions
      `;
  }).on('mouseout', () => {
    tooltip.classList.remove('show');
  });


  //console.log(arr);


  // create axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', `translate(0, ${height - padding})`).
  call(xAxis);

  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', `translate(${padding}, 0)`).
  call(yAxis);
}

// const ticks = document.querySelectorAll('#x-axis .tick');

// console.log(ticks.length);

// const arr = [];

// ticks.forEach(tick => {
//   const text = tick.querySelector('text');

//   arr.push([
//     text.innerHTML.replace(',', ''),
//     tick.getAttribute('transform')
//   ])
// });

// const bars = document.querySelectorAll('.bar');

// bars.forEach(bar => {
//   const [year, month] = bar.getAttribute('data-date').split('-');
//   if(month === '01') {
//     const found = arr.forEach(a => {
//       if(a[0] === year){
//         a.push(bar.getAttribute('x'));
//       }

//     });
//   }
// });
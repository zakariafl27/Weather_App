import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function WeatherChart ({ weatherData, chartMode }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (weatherData && chartRef.current) {
      renderChart();
    }
  }, [weatherData, chartMode]);

  const renderChart = () => {
    if (!chartRef.current || !weatherData) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = chartRef.current.offsetWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = weatherData.hourly.map((d, i) => ({
      index: i,
      time: d.time,
      value: chartMode === 'temperature' ? d.temp : 
             chartMode === 'precipitation' ? d.precip : 
             d.wind
    }));

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.value) - 2,
        d3.max(data, d => d.value) + 2
      ])
      .range([height, 0]);

    const area = d3.area()
      .x((d, i) => x(i))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveCardinal.tension(0.5));

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d.value))
      .curve(d3.curveCardinal.tension(0.5));

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8B9FE8")
      .attr("stop-opacity", 0.3);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#E8EBFA")
      .attr("stop-opacity", 0.1);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5B6FB8")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    data.forEach((d, i) => {
      svg.append("circle")
        .attr("cx", x(i))
        .attr("cy", y(d.value))
        .attr("r", 0)
        .attr("fill", "#5B6FB8")
        .transition()
        .delay(i * 50)
        .duration(500)
        .attr("r", 4);

      svg.append("text")
        .attr("x", x(i))
        .attr("y", y(d.value) - 12)
        .attr("text-anchor", "middle")
        .attr("fill", "#2C3E50")
        .attr("font-size", "13px")
        .attr("font-weight", "500")
        .attr("opacity", 0)
        .text(Math.round(d.value))
        .transition()
        .delay(i * 50)
        .duration(500)
        .attr("opacity", 1);
    });

    const xAxis = d3.axisBottom(x)
      .tickValues(d3.range(data.length))
      .tickFormat((d, i) => {
        const time = data[i].time;
        return time.split(' ')[0];
      });

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove())
      .call(g => g.selectAll("text")
        .attr("fill", "#6B7280")
        .attr("font-size", "11px")
        .attr("font-family", "'Outfit', sans-serif"));
  };

  return <div ref={chartRef} className="w-full"></div>;
};


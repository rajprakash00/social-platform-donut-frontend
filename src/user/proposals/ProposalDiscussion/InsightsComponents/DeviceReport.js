import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import CustomDatePicker from "./DatePicker";
import { queryReport } from "./queryReport";
import { ClockLoader } from "react-spinners";
import { colors } from "./styles";
import moment from "moment";
import { getDeviceAnalytics} from '../../../../actions/analyticsAction'
import {connect} from 'react-redux'

const DeviceReport = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
    colors: [],
  };
  const [reportData, setReportData] = useState(INITIAL_STATE);
  const [startDate, setStartDate] = useState(
    moment().add(-10, "days").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const {deviceAnalytics, proposalId, getDeviceAnalytics} = props

  const displayResults = () => {
    let labels = [];
    let values = [];
    let bgColors = [];

    if(deviceAnalytics.length > 0){
      deviceAnalytics.forEach((row, idx) => {
        labels.push(row[0]);
        values.push(row[1]);
        bgColors.push(colors[idx]);
      });
    }
    setReportData({
      ...reportData,
      labels,
      values,
      colors: bgColors,
    });
    setLoading(false);
  };

  const data = {
    labels: reportData.labels,
    datasets: [
      {
        data: reportData.values,
        backgroundColor: reportData.colors,
      },
    ],
  };

  useEffect(() => {
    setLoading(true)
    getDeviceAnalytics(startDate, endDate, proposalId)
  }, [startDate, endDate]);

  useEffect(()=> {
    displayResults()
    setLoading(false)
  }, [deviceAnalytics])

  return (
    <div className="report-wrapper">
      <h2 className="chart-title">Device Used</h2>
      <div className="datepicker-content">
        <CustomDatePicker
          placeholder={"Start date"}
          date={startDate}
          handleDateChange={(date) => setStartDate(date)}
        />
        <CustomDatePicker
          placeholder={"End date"}
          date={endDate}
          handleDateChange={(date) => setEndDate(date)}
        />
      </div>
      {isLoading ? (
        <ClockLoader
          color={"#1DA9DF"}
          loading={isLoading}
          size={50}
          css="display: block;
        margin: 0 auto;"
        />
      ) : (
        <div className="chart-wrapper">
          <Doughnut data={data} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  deviceAnalytics: state.analytics.deviceAnalytics
})

export default connect(mapStateToProps, {getDeviceAnalytics}) (DeviceReport);

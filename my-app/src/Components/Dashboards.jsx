import React, { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Car,
  Battery,
  Zap,
  Upload,
  Download,
  Calendar,
  Filter,
  MapPin,
  Award
} from 'lucide-react';
import * as Papa from 'papaparse';
import _ from 'lodash';

const Dashboard = () => {
  const [csvData, setCsvData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [filterMake, setFilterMake] = useState('all');

  // Sample EV data based on your CSV structure
  const sampleData = [
    { VIN: 'SYV9GAEVZS', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98122', ModelYear: '2020', Make: 'TESLA', Model: 'MODEL Y', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '291', BaseMSRP: '0', LegislativeDistrict: '37', DOLVehicleID: '1.17E+08', VehicleLocation: 'POINT (-122.302451 47.60994)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '7SAYGDEEP', County: 'Snohomish', City: 'Bothell', State: 'WA', PostalCode: '98021', ModelYear: '2023', Make: 'TESLA', Model: 'MODEL Y', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '330', BaseMSRP: '0', LegislativeDistrict: '1', DOLVehicleID: '2.44E+08', VehicleLocation: 'POINT (-122.205946 47.762428)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '5YJ3A1E4X', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98109', ModelYear: '2019', Make: 'TESLA', Model: 'MODEL S', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '270', BaseMSRP: '0', LegislativeDistrict: '36', DOLVehicleID: '1.57E+08', VehicleLocation: 'POINT (-122.342428 47.624428)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '5YJ3A1E27', County: 'King', City: 'Issaquah', State: 'WA', PostalCode: '98027', ModelYear: '2016', Make: 'TESLA', Model: 'MODEL S', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '210', BaseMSRP: '0', LegislativeDistrict: '5', DOLVehicleID: '1.65E+08', VehicleLocation: 'POINT (-122.032946 47.530946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: '5YJYGDEE3', County: 'King', City: 'Suquamish', State: 'WA', PostalCode: '98392', ModelYear: '2021', Make: 'TESLA', Model: 'MODEL Y', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '326', BaseMSRP: '0', LegislativeDistrict: '23', DOLVehicleID: '2.05E+08', VehicleLocation: 'POINT (-122.552946 47.732946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: '3FA6P0SU8', County: 'Thurston', City: 'Yelm', State: 'WA', PostalCode: '98597', ModelYear: '2017', Make: 'FORD', Model: 'FUSION', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '21', BaseMSRP: '0', LegislativeDistrict: '2', DOLVehicleID: '1.22E+08', VehicleLocation: 'POINT (-122.605946 47.042946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '1N4AZ0CP2', County: 'Yakima', City: 'Yakima', State: 'WA', PostalCode: '98903', ModelYear: '2013', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '75', BaseMSRP: '0', LegislativeDistrict: '14', DOLVehicleID: '1.5E+08', VehicleLocation: 'POINT (-120.505946 46.602946)', ElectricUtility: 'PACIFIC POWER', CensusTract: '5.31E+10' },
    { VIN: 'KNAGV4LE8', County: 'Snohomish', City: 'Bothell', State: 'WA', PostalCode: '98012', ModelYear: '2018', Make: 'KIA', Model: 'OPTIMA', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '29', BaseMSRP: '0', LegislativeDistrict: '1', DOLVehicleID: '2.91E+08', VehicleLocation: 'POINT (-122.205946 47.762428)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '1N4AZ0CP3', County: 'Kitsap', City: 'Port Orchard', State: 'WA', PostalCode: '98366', ModelYear: '2015', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '84', BaseMSRP: '0', LegislativeDistrict: '26', DOLVehicleID: '1.37E+08', VehicleLocation: 'POINT (-122.639946 47.540946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: '5UXTA6C03', County: 'King', City: 'Auburn', State: 'WA', PostalCode: '98001', ModelYear: '2022', Make: 'BMW', Model: 'X5', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '30', BaseMSRP: '0', LegislativeDistrict: '47', DOLVehicleID: '2.4E+08', VehicleLocation: 'POINT (-122.227946 47.307946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: '5YJYGDEE4', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98144', ModelYear: '2020', Make: 'TESLA', Model: 'MODEL Y', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '291', BaseMSRP: '0', LegislativeDistrict: '37', DOLVehicleID: '1.13E+08', VehicleLocation: 'POINT (-122.299946 47.577946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: 'WBY8P8C09', County: 'King', City: 'Kitsap', State: 'WA', PostalCode: '98110', ModelYear: '2019', Make: 'BMW', Model: 'I3', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '126', BaseMSRP: '0', LegislativeDistrict: '23', DOLVehicleID: '2.29E+08', VehicleLocation: 'POINT (-122.542946 47.627946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: '1G1FZ6S03', County: 'Yakima', City: 'Yakima', State: 'WA', PostalCode: '98908', ModelYear: '2021', Make: 'CHEVROLET', Model: 'BOLT EV', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '259', BaseMSRP: '0', LegislativeDistrict: '14', DOLVehicleID: '1.57E+08', VehicleLocation: 'POINT (-120.527946 46.582946)', ElectricUtility: 'PACIFIC POWER', CensusTract: '5.31E+10' },
    { VIN: 'WA1E2AF77', County: 'Snohomish', City: 'Lynnwood', State: 'WA', PostalCode: '98036', ModelYear: '2021', Make: 'AUDI', Model: 'Q5 E', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '18', BaseMSRP: '0', LegislativeDistrict: '1', DOLVehicleID: '1.68E+08', VehicleLocation: 'POINT (-122.315946 47.820946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '1N4AZ0CP4', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98119', ModelYear: '2015', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '84', BaseMSRP: '0', LegislativeDistrict: '36', DOLVehicleID: '1.26E+08', VehicleLocation: 'POINT (-122.373946 47.637946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '1N4AZ0CP5', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98107', ModelYear: '2013', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '75', BaseMSRP: '0', LegislativeDistrict: '43', DOLVehicleID: '1.01E+08', VehicleLocation: 'POINT (-122.375946 47.669946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '1N4BZ0CP6', County: 'Snohomish', City: 'Lynnwood', State: 'WA', PostalCode: '98087', ModelYear: '2013', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '75', BaseMSRP: '0', LegislativeDistrict: '21', DOLVehicleID: '1.4E+08', VehicleLocation: 'POINT (-122.295946 47.820946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '1N4BZ0CP7', County: 'Snohomish', City: 'Bothell', State: 'WA', PostalCode: '98021', ModelYear: '2017', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '107', BaseMSRP: '0', LegislativeDistrict: '1', DOLVehicleID: '3.49E+08', VehicleLocation: 'POINT (-122.205946 47.762428)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '5YJ3E1EB8', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98126', ModelYear: '2020', Make: 'TESLA', Model: 'MODEL 3', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '322', BaseMSRP: '0', LegislativeDistrict: '34', DOLVehicleID: '1.22E+08', VehicleLocation: 'POINT (-122.353946 47.527946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '5YJ3E1EA9', County: 'King', City: 'Yakima', State: 'WA', PostalCode: '98903', ModelYear: '2019', Make: 'TESLA', Model: 'MODEL 3', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '220', BaseMSRP: '0', LegislativeDistrict: '14', DOLVehicleID: '1.98E+08', VehicleLocation: 'POINT (-120.505946 46.602946)', ElectricUtility: 'PACIFIC POWER', CensusTract: '5.31E+10' },
    { VIN: '1N4BZ0CP8', County: 'Thurston', City: 'Olympia', State: 'WA', PostalCode: '98506', ModelYear: '2017', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '107', BaseMSRP: '0', LegislativeDistrict: '22', DOLVehicleID: '1.51E+08', VehicleLocation: 'POINT (-122.895946 47.040946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: 'WBY1Z4C59', County: 'King', City: 'Renton', State: 'WA', PostalCode: '98059', ModelYear: '2014', Make: 'BMW', Model: 'I3', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '72', BaseMSRP: '0', LegislativeDistrict: '11', DOLVehicleID: '2.54E+08', VehicleLocation: 'POINT (-122.202946 47.482946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: '1FADP5CU0', County: 'Yakima', City: 'Yakima', State: 'WA', PostalCode: '98902', ModelYear: '2013', Make: 'FORD', Model: 'C-MAX', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '19', BaseMSRP: '0', LegislativeDistrict: '14', DOLVehicleID: '1.32E+08', VehicleLocation: 'POINT (-120.505946 46.602946)', ElectricUtility: 'PACIFIC POWER', CensusTract: '5.31E+10' },
    { VIN: 'KNDCD3LD6', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98118', ModelYear: '2018', Make: 'KIA', Model: 'NIRO', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '26', BaseMSRP: '0', LegislativeDistrict: '37', DOLVehicleID: '1.7E+08', VehicleLocation: 'POINT (-122.265946 47.527946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: 'JN1AZ0CP9', County: 'Tenino', City: 'Tenino', State: 'WA', PostalCode: '98589', ModelYear: '2012', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '73', BaseMSRP: '0', LegislativeDistrict: '20', DOLVehicleID: '1.32E+08', VehicleLocation: 'POINT (-122.851946 46.860946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '1G1RC6S50', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98115', ModelYear: '2018', Make: 'CHEVROLET', Model: 'VOLT', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '53', BaseMSRP: '0', LegislativeDistrict: '46', DOLVehicleID: '2.1E+08', VehicleLocation: 'POINT (-122.295946 47.677946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '5UXTA6C04', County: 'Snohomish', City: 'Bothell', State: 'WA', PostalCode: '98021', ModelYear: '2023', Make: 'BMW', Model: 'X5', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '31', BaseMSRP: '0', LegislativeDistrict: '1', DOLVehicleID: '2.8E+08', VehicleLocation: 'POINT (-122.205946 47.762428)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: '5YJYGDEE5', County: 'Pierce', City: 'Tacoma', State: 'WA', PostalCode: '98407', ModelYear: '2021', Make: 'TESLA', Model: 'MODEL Y', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '326', BaseMSRP: '0', LegislativeDistrict: '27', DOLVehicleID: '2.3E+08', VehicleLocation: 'POINT (-122.479946 47.267946)', ElectricUtility: 'TACOMA POWER', CensusTract: '5.31E+10' },
    { VIN: '1G1FZ6S04', County: 'Pierce', City: 'Puyallup', State: 'WA', PostalCode: '98374', ModelYear: '2022', Make: 'CHEVROLET', Model: 'BOLT EUV', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '247', BaseMSRP: '0', LegislativeDistrict: '25', DOLVehicleID: '1.85E+08', VehicleLocation: 'POINT (-122.293946 47.185946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: 'WDDGF8BB7', County: 'King', City: 'Bellevue', State: 'WA', PostalCode: '98005', ModelYear: '2019', Make: 'MERCEDES-BENZ', Model: 'GLE', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '22', BaseMSRP: '0', LegislativeDistrict: '41', DOLVehicleID: '1.95E+08', VehicleLocation: 'POINT (-122.200946 47.610946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: 'WP0AA2A79', County: 'King', City: 'Mercer Island', State: 'WA', PostalCode: '98040', ModelYear: '2018', Make: 'PORSCHE', Model: 'PANAMERA', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '22', BaseMSRP: '0', LegislativeDistrict: '41', DOLVehicleID: '1.75E+08', VehicleLocation: 'POINT (-122.230946 47.570946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: 'YV4H60CF8', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98102', ModelYear: '2020', Make: 'VOLVO', Model: 'XC60', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '19', BaseMSRP: '0', LegislativeDistrict: '43', DOLVehicleID: '1.88E+08', VehicleLocation: 'POINT (-122.320946 47.630946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '3C3CFFER8', County: 'Pierce', City: 'Lakewood', State: 'WA', PostalCode: '98498', ModelYear: '2017', Make: 'FIAT', Model: '500E', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '84', BaseMSRP: '0', LegislativeDistrict: '29', DOLVehicleID: '1.42E+08', VehicleLocation: 'POINT (-122.520946 47.172946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: 'JTDKN3DP0', County: 'King', City: 'Redmond', State: 'WA', PostalCode: '98052', ModelYear: '2021', Make: 'TOYOTA', Model: 'PRIUS PRIME', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '25', BaseMSRP: '0', LegislativeDistrict: '48', DOLVehicleID: '2.15E+08', VehicleLocation: 'POINT (-122.123946 47.674946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.3E+10' },
    { VIN: 'JF2GTANC4', County: 'Skagit', City: 'Burlington', State: 'WA', PostalCode: '98233', ModelYear: '2019', Make: 'SUBARU', Model: 'CROSSTREK', ElectricVehicleType: 'Plug-in Hybrid Electric Vehicle (PHEV)', ElectricRange: '17', BaseMSRP: '0', LegislativeDistrict: '10', DOLVehicleID: '1.65E+08', VehicleLocation: 'POINT (-122.325946 48.476946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: 'WVGMP7AX5', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98103', ModelYear: '2022', Make: 'VOLKSWAGEN', Model: 'ID.4', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '260', BaseMSRP: '0', LegislativeDistrict: '46', DOLVehicleID: '2.45E+08', VehicleLocation: 'POINT (-122.342946 47.662946)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: 'KNDJP3A58', County: 'Spokane', City: 'Spokane', State: 'WA', PostalCode: '99201', ModelYear: '2020', Make: 'HYUNDAI', Model: 'IONIQ', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '170', BaseMSRP: '0', LegislativeDistrict: '3', DOLVehicleID: '1.92E+08', VehicleLocation: 'POINT (-117.426946 47.658946)', ElectricUtility: 'AVISTA UTILITIES', CensusTract: '5.31E+10' },
    { VIN: 'KMHH14JA7', County: 'Clark', City: 'Vancouver', State: 'WA', PostalCode: '98662', ModelYear: '2023', Make: 'HYUNDAI', Model: 'IONIQ 6', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '305', BaseMSRP: '0', LegislativeDistrict: '17', DOLVehicleID: '2.65E+08', VehicleLocation: 'POINT (-122.665946 45.638946)', ElectricUtility: 'CLARK PUBLIC UTILITIES', CensusTract: '5.31E+10' },
    { VIN: '1FTEW1EP8', County: 'King', City: 'Seattle', State: 'WA', PostalCode: '98109', ModelYear: '2022', Make: 'FORD', Model: 'F-150 LIGHTNING', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '230', BaseMSRP: '0', LegislativeDistrict: '36', DOLVehicleID: '2.58E+08', VehicleLocation: 'POINT (-122.342428 47.624428)', ElectricUtility: 'SEATTLE CITY LIGHT', CensusTract: '5.3E+10' },
    { VIN: '1G1FW6S00', County: 'Whatcom', City: 'Bellingham', State: 'WA', PostalCode: '98225', ModelYear: '2017', Make: 'CHEVROLET', Model: 'BOLT EV', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '238', BaseMSRP: '0', LegislativeDistrict: '42', DOLVehicleID: '1.48E+08', VehicleLocation: 'POINT (-122.488946 48.747946)', ElectricUtility: 'PUGET SOUND ENERGY INC', CensusTract: '5.31E+10' },
    { VIN: 'JN1BZ0CP4', County: 'Jefferson', City: 'Port Townsend', State: 'WA', PostalCode: '98368', ModelYear: '2018', Make: 'NISSAN', Model: 'LEAF', ElectricVehicleType: 'Battery Electric Vehicle (BEV)', ElectricRange: '151', BaseMSRP: '0', LegislativeDistrict: '24', DOLVehicleID: '1.72E+08', VehicleLocation: 'POINT (-122.760946 48.117946)', ElectricUtility: 'JEFFERSON COUNTY PUD', CensusTract: '5.31E+10' }
  ];

const handleFileUpload = useCallback((event) => {
  const file = event.target.files[0];
  if (!file) return;

  setIsLoading(true);
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    complete: (results) => {
      // Normalize keys: remove spaces, make camelCase
      const normalizedData = results.data.map(row => {
        const newRow = {};
        for (let key in row) {
          const normalizedKey = key.replace(/\s+/g, ''); // remove spaces
          newRow[normalizedKey] = row[key];
        }
        return newRow;
      });
      console.log('Parsed CSV data:', normalizedData);
      setCsvData(normalizedData);
      setIsLoading(false);
    },
    error: (error) => {
      console.error('Error parsing CSV:', error);
      setIsLoading(false);
    }
  });
}, []);


  // Use either uploaded data or sample data
  const data = csvData || sampleData;

  // Data processing functions
  const processData = () => {
    if (!data || data.length === 0) return null;

    // Process makes
    const makeStats = _.chain(data)
      .groupBy('Make')
      .map((vehicles, make) => ({
        make,
        count: vehicles.length,
        avgRange: _.meanBy(vehicles, v => parseInt(v.ElectricRange) || 0),
        types: _.uniq(vehicles.map(v => v.ElectricVehicleType))
      }))
      .orderBy('count', 'desc')
      .value();

    // Process years
    const yearStats = _.chain(data)
      .groupBy('ModelYear')
      .map((vehicles, year) => ({
        year: parseInt(year),
        count: vehicles.length,
        avgRange: _.meanBy(vehicles, v => parseInt(v.ElectricRange) || 0)
      }))
      .filter(item => item.year >= 2010)
      .orderBy('year')
      .value();

    // Process counties
    const countyStats = _.chain(data)
      .groupBy('County')
      .map((vehicles, county) => ({
        county,
        count: vehicles.length,
        makes: _.uniq(vehicles.map(v => v.Make)).length
      }))
      .orderBy('count', 'desc')
      .take(10)
      .value();

    // Process electric vehicle types
    const typeStats = _.chain(data)
      .groupBy('ElectricVehicleType')
      .map((vehicles, type) => ({
        type: type?.replace('Battery Electric Vehicle (BEV)', 'BEV').replace('Plug-in Hybrid Electric Vehicle (PHEV)', 'PHEV') || 'Unknown',
        count: vehicles.length,
        avgRange: _.meanBy(vehicles, v => parseInt(v.ElectricRange) || 0)
      }))
      .orderBy('count', 'desc')
      .value();

    return {
      makeStats,
      yearStats,
      countyStats,
      typeStats,
      totalVehicles: data.length,
      avgRange: _.meanBy(data, v => parseInt(v.ElectricRange) || 0),
      topMake: makeStats[0]?.make || 'N/A',
      topCounty: countyStats[0]?.county || 'N/A'
    };
  };

  const stats = processData();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue', subtitle = '' }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Electric Vehicle Analytics Dashboard</h2>
              <p className="text-sm text-gray-600 mt-1">Comprehensive EV data insights and trends</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </label>
                  {/* Info message */}
  <p className="mt-2 text-sm text-gray-500">
    For more detailed analysis, please upload your CSV file.
  </p>

              </div>
              <div className="flex space-x-2 bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedView === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedView('trends')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedView === 'trends'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Trends
                </button>
                <button
                  onClick={() => setSelectedView('geography')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedView === 'geography'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Geography
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Processing CSV data...</span>
          </div>
        )}

        {!isLoading && stats && (
          <>
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Vehicles"
                value={stats.totalVehicles.toLocaleString()}
                icon={Car}
                color="blue"
                subtitle="Registered EVs"
              />
              <MetricCard
                title="Average Range"
                value={`${Math.round(stats.avgRange)} mi`}
                icon={Battery}
                color="green"
                subtitle="Electric range"
              />
              <MetricCard
                title="Top Manufacturer"
                value={stats.topMake}
                icon={Award}
                color="purple"
                subtitle={`${stats.makeStats[0]?.count || 0} vehicles`}
              />
              <MetricCard
                title="Top County"
                value={stats.topCounty}
                icon={MapPin}
                color="orange"
                subtitle={`${stats.countyStats[0]?.count || 0} vehicles`}
              />
            </div>

            {selectedView === 'overview' && (
              <>
                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* EV Types Distribution */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Electric Vehicle Types</h2>
                      <p className="text-sm text-gray-600">Distribution of BEV vs PHEV</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.typeStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, percent }) => `${type} ${(percent * 100).toFixed(1)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {stats.typeStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top Manufacturers */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Top Manufacturers</h2>
                      <p className="text-sm text-gray-600">Vehicle count by manufacturer</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.makeStats.slice(0, 8)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="make" 
                          stroke="#6b7280" 
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="count" 
                          fill="#3B82F6" 
                          radius={[4, 4, 0, 0]}
                          name="Vehicles"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {selectedView === 'trends' && (
              <>
                {/* Year-over-Year Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Registration Trends by Year</h2>
                      <p className="text-sm text-gray-600">Number of EVs registered each year</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={stats.yearStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="year" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.3}
                          strokeWidth={2}
                          name="Registrations"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Average Range by Year</h2>
                      <p className="text-sm text-gray-600">Evolution of electric vehicle range</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.yearStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="year" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="avgRange"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Avg Range (mi)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {selectedView === 'geography' && (
              <>
                {/* Geographic Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Top Counties</h2>
                      <p className="text-sm text-gray-600">EV registrations by county</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.countyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="county" 
                          stroke="#6b7280"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="count" 
                          fill="#8B5CF6" 
                          radius={[4, 4, 0, 0]}
                          name="Vehicles"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">County Diversity</h2>
                      <p className="text-sm text-gray-600">Number of different makes per county</p>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {stats.countyStats.map((county, index) => (
                        <div key={county.county} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{county.county}</p>
                              <p className="text-sm text-gray-600">{county.count} vehicles</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{county.makes}</p>
                            <p className="text-sm text-gray-600">makes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Data Summary Table */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Data Summary</h2>
                  <p className="text-sm text-gray-600">Key insights from the dataset</p>
                </div>
                <div className="text-sm text-gray-500">
                  {csvData ? 'Custom Data' : 'Sample Data'} • {stats.totalVehicles} records
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Vehicle Types</h3>
                  <div className="space-y-1">
                    {stats.typeStats.map((type, index) => (
                      <div key={type.type} className="flex justify-between text-sm">
                        <span className="text-blue-800">{type.type}</span>
                        <span className="font-medium">{type.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Top 3 Manufacturers</h3>
                  <div className="space-y-1">
                    {stats.makeStats.slice(0, 3).map((make, index) => (
                      <div key={make.make} className="flex justify-between text-sm">
                        <span className="text-green-800">{make.make}</span>
                        <span className="font-medium">{make.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Range Statistics</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-800">Average Range</span>
                      <span className="font-medium">{Math.round(stats.avgRange)} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-800">BEV Avg Range</span>
                      <span className="font-medium">
                        {Math.round(stats.typeStats.find(t => t.type === 'BEV')?.avgRange || 0)} mi
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-800">PHEV Avg Range</span>
                      <span className="font-medium">
                        {Math.round(stats.typeStats.find(t => t.type === 'PHEV')?.avgRange || 0)} mi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!isLoading && !stats && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">Upload a CSV file to view your electric vehicle data insights</p>
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload CSV File
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
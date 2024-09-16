import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HomePage = () => {
    const [values, setValues] = useState({
        terrain1: { material1: '', material2: '', material3: '' },
        terrain2: { material1: '', material2: '', material3: '' },
        terrain3: { material1: '', material2: '', material3: '' },
    });

    const [averages, setAverages] = useState({
        terrain1: { material1: 0, material2: 0, material3: 0 },
        terrain2: { material1: 0, material2: 0, material3: 0 },
        terrain3: { material1: 0, material2: 0, material3: 0 },
    });

    const [calculationValues, setCalculationValues] = useState({
        theta: '',
        time: '',
        radius: '',
    });

    const [results, setResults] = useState({
        acceleration: 0,
        distance: 0,
        revolutions: 0,
    });

    const [experimentData, setExperimentData] = useState({
        numberOfExperiments: '',
        experimentValues: [],
        average: 0,
    });

    const handleInputChange = (e, terrain, material) => {
        setValues({
            ...values,
            [terrain]: {
                ...values[terrain],
                [material]: e.target.value,
            },
        });
    };

    const handleCalculationInputChange = (e) => {
        setCalculationValues({
            ...calculationValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleExperimentChange = (e) => {
        const { name, value } = e.target;
        if (name === 'numberOfExperiments') {
            setExperimentData({
                ...experimentData,
                numberOfExperiments: value,
                experimentValues: Array(parseInt(value) || 0).fill(''),
            });
        } else {
            const index = parseInt(name.split('-')[1]);
            const updatedValues = [...experimentData.experimentValues];
            updatedValues[index] = value;
            setExperimentData({
                ...experimentData,
                experimentValues: updatedValues,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAverages = {
            terrain1: {
                material1: parseFloat(values.terrain1.material1) || 0,
                material2: parseFloat(values.terrain1.material2) || 0,
                material3: parseFloat(values.terrain1.material3) || 0,
            },
            terrain2: {
                material1: parseFloat(values.terrain2.material1) || 0,
                material2: parseFloat(values.terrain2.material2) || 0,
                material3: parseFloat(values.terrain2.material3) || 0,
            },
            terrain3: {
                material1: parseFloat(values.terrain3.material1) || 0,
                material2: parseFloat(values.terrain3.material2) || 0,
                material3: parseFloat(values.terrain3.material3) || 0,
            },
        };
        setAverages(newAverages);
    };

    const resetForm = () => {
        setValues({
            terrain1: { material1: '', material2: '', material3: '' },
            terrain2: { material1: '', material2: '', material3: '' },
            terrain3: { material1: '', material2: '', material3: '' },
        });
    };

    const resetTable = () => {
        setAverages({
            terrain1: { material1: 0, material2: 0, material3: 0 },
            terrain2: { material1: 0, material2: 0, material3: 0 },
            terrain3: { material1: 0, material2: 0, material3: 0 },
        });
    };

    const handleCalculate = () => {
        const g = 9.8; // Gravitational acceleration in m/s^2
        const theta = parseFloat(calculationValues.theta) || 0;
        const time = parseFloat(calculationValues.time) || 0;
        const radius = parseFloat(calculationValues.radius) || 0;

        const acceleration = g * Math.sin((theta * Math.PI) / 180);
        const distance = 0.5 * acceleration * time * time;
        const revolutions = distance / (2 * Math.PI * radius);

        setResults({
            acceleration,
            distance,
            revolutions,
        });
    };

    const resetCalculations = () => {
        setCalculationValues({
            theta: '',
            time: '',
            radius: '',
        });

        setResults({
            acceleration: 0,
            distance: 0,
            revolutions: 0,
        });
    };

    const handleExperimentSubmit = () => {
        const sum = experimentData.experimentValues.reduce((acc, value) => acc + parseFloat(value || 0), 0);
        const average = sum / (experimentData.experimentValues.length || 1);
        setExperimentData({
            ...experimentData,
            average,
        });
    };

    const resetExperiment = () => {
        setExperimentData({
            numberOfExperiments: '',
            experimentValues: [],
            average: 0,
        });
    };

    // Chart data preparation
    const chartData = {
        labels: ['Terrain Type 1', 'Terrain Type 2', 'Terrain Type 3'],
        datasets: [
            {
                label: 'Material Type 1',
                data: [
                    averages.terrain1.material1,
                    averages.terrain2.material1,
                    averages.terrain3.material1,
                ],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            },
            {
                label: 'Material Type 2',
                data: [
                    averages.terrain1.material2,
                    averages.terrain2.material2,
                    averages.terrain3.material2,
                ],
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
            },
            {
                label: 'Material Type 3',
                data: [
                    averages.terrain1.material3,
                    averages.terrain2.material3,
                    averages.terrain3.material3,
                ],
                borderColor: 'rgba(255,159,64,1)',
                backgroundColor: 'rgba(255,159,64,0.2)',
            },
        ],
    };

    return (
        <Container>
            <h1>Material and Terrain Types</h1>

            {/* 1. Single Experiment Results */}
            <Card>
                <CardContent>
                    <h2>Step 1: Single Experiment Results</h2>
                    <Grid container spacing={2}>
                        {/* Calculation Inputs */}
                        <Grid item xs={12}>
                            <TextField
                                name="theta"
                                label="Theta"
                                value={calculationValues.theta}
                                onChange={handleCalculationInputChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="time"
                                label="Time"
                                value={calculationValues.time}
                                onChange={handleCalculationInputChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="radius"
                                label="Radius"
                                value={calculationValues.radius}
                                onChange={handleCalculationInputChange}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button onClick={handleCalculate} variant="contained" color="primary">Calculate</Button>
                            <Button onClick={resetCalculations} variant="outlined" color="secondary" sx={{ marginLeft: 2 }}>Reset Calculations</Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>Acceleration: {results.acceleration.toFixed(2)}</Typography>
                            <Typography>Distance: {results.distance.toFixed(2)}</Typography>
                            <Typography>Revolutions: {results.revolutions.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Step 2: Number of Experiments */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <h2>Step 2: Number of Experiments</h2>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="numberOfExperiments"
                                label="Number of Experiments"
                                value={experimentData.numberOfExperiments}
                                onChange={handleExperimentChange}
                                fullWidth
                            />
                        </Grid>
                        {experimentData.experimentValues.map((value, index) => (
                            <Grid item xs={12} key={index}>
                                <TextField
                                    name={`experiment-${index}`}
                                    label={`Experiment ${index + 1}`}
                                    value={value}
                                    onChange={handleExperimentChange}
                                    fullWidth
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button onClick={handleExperimentSubmit} variant="contained" color="primary">Submit Experiments</Button>
                            <Button onClick={resetExperiment} variant="outlined" color="secondary" sx={{ marginLeft: 2 }}>Reset Experiment</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Average Value: {experimentData.average.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 3. Form for table input */}
            <Card sx={{ marginBottom: 4 }}>
                <CardContent>
                <h2>Step 3: Form for table input</h2>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Input Fields */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 1 - Material Type 1"
                                    value={values.terrain1.material1}
                                    onChange={(e) => handleInputChange(e, 'terrain1', 'material1')}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 1 - Material Type 2"
                                    value={values.terrain1.material2}
                                    onChange={(e) => handleInputChange(e, 'terrain1', 'material2')}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 1 - Material Type 3"
                                    value={values.terrain1.material3}
                                    onChange={(e) => handleInputChange(e, 'terrain1', 'material3')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 2 - Material Type 1"
                                    value={values.terrain2.material1}
                                    onChange={(e) => handleInputChange(e, 'terrain2', 'material1')}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 2 - Material Type 2"
                                    value={values.terrain2.material2}
                                    onChange={(e) => handleInputChange(e, 'terrain2', 'material2')}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 2 - Material Type 3"
                                    value={values.terrain2.material3}
                                    onChange={(e) => handleInputChange(e, 'terrain2', 'material3')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 3 - Material Type 1"
                                    value={values.terrain3.material1}
                                    onChange={(e) => handleInputChange(e, 'terrain3', 'material1')}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 3 - Material Type 2"
                                    value={values.terrain3.material2}
                                    onChange={(e) => handleInputChange(e, 'terrain3', 'material2')}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Terrain Type 3 - Material Type 3"
                                    value={values.terrain3.material3}
                                    onChange={(e) => handleInputChange(e, 'terrain3', 'material3')}
                                    fullWidth
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">Calculate Averages</Button>
                                <Button onClick={resetForm} variant="outlined" color="secondary" sx={{ marginLeft: 2 }}>Reset Form</Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* 4. Average Values Table */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <h2>Step 4: Average Values Table</h2>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Terrain Type</TableCell>
                                    <TableCell>Material Type 1</TableCell>
                                    <TableCell>Material Type 2</TableCell>
                                    <TableCell>Material Type 3</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(averages).map((terrain) => (
                                    <TableRow key={terrain}>
                                        <TableCell>{terrain}</TableCell>
                                        <TableCell>{averages[terrain].material1.toFixed(2)}</TableCell>
                                        <TableCell>{averages[terrain].material2.toFixed(2)}</TableCell>
                                        <TableCell>{averages[terrain].material3.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* 5. Comaparision chart */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <h2>Step 5: Chart</h2>
                    <Line data={chartData} />
                </CardContent>
            </Card>
        </Container>
    );
};

export default HomePage;

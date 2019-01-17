import React from 'react';
import tips from './tips';
import {sortAs} from '../src/Utilities';
import TableRenderers from '../src/TableRenderers';
import createPlotlyComponent from 'react-plotly.js/factory';
import createPlotlyRenderers from '../src/PlotlyRenderers';
import PivotTableUI from '../src/PivotTableUI';
import '../src/pivottable.css';
import Papa from 'papaparse';

const Plot = createPlotlyComponent(window.Plotly);

class PivotTableUISmartWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {pivotState: props};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({pivotState: nextProps});
    }

    render() {
        return (
            <PivotTableUI
                renderers={Object.assign(
                    {},
                    TableRenderers,
                    createPlotlyRenderers(Plot)
                )}
                {...this.state.pivotState}
                onChange={s => this.setState({pivotState: s})}
                unusedOrientationCutoff={Infinity}
            />
        );
    }
}

export default class App extends React.Component {
    componentWillMount() {
        this.setState({
            mode: 'demo',
            filename: 'Sample Dataset: Tips',
            pivotState: {
                data: tips,
                rows: ['Payer Gender'],
                cols: ['Party Size'],
                aggregatorName: 'Sum over Sum',
                vals: ['Tip', 'Total Bill'],
                rendererName: 'Grouped Column Chart',
                sorters: {
                    Meal: sortAs(['Lunch', 'Dinner']),
                    'Day of Week': sortAs([
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                    ]),
                },
                plotlyOptions: {width: 900, height: 500},
                plotlyConfig: {},
                tableOptions: {
                    clickCallback: function(e, value, filters, pivotData) {
                        var names = [];
                        pivotData.forEachMatchingRecord(filters, function(
                            record
                        ) {
                            names.push(record.Meal);
                        });
                        alert(names.join('\n'));
                    },
                },
            },
        });
    }

    render() {
        return (
            <div className="row">
                <h2 className="text-center">{this.state.filename}</h2>
                <br />
                <PivotTableUISmartWrapper {...this.state.pivotState} />
            </div>
        );
    }
}

import React from 'react';
import { MapsComponent, Inject, LayersDirective, LayerDirective, Selection, Highlight, MarkersDirective, MarkerDirective, Marker, MapsTooltip } from '@syncfusion/ej2-react-maps';
import data from '../../map-data/default-datasource.json';
import asia from '../../map-data/asia.json';
import africa from '../../map-data/africa.json';
import europe from '../../map-data/europe.json';
import northamerica from '../../map-data/north-america.json';
import southamerica from '../../map-data/south-america.json';
import oceania from '../../map-data/oceania.json';
import world from '../../map-data/world-map.json';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
export class SampleBase extends React.PureComponent {
    rendereComplete() {
        /**custom render complete function */
    }
    componentDidMount() {
        setTimeout(() => {
            this.rendereComplete();
        });
    }
}

let datasource = data;
// Data ref
const SAMPLE_CSS = `
    .control-fluid {
		padding: 0px !important;
    }
    .backLabel:hover {
        cursor: pointer;
}`;

let touchmove;
export default class MapContinent extends SampleBase {

    constructor(props) {
        super(props);

        const {continent} = props;

        this.state = {continent};
        this.maps = {asia, europe, northamerica, southamerica, oceania, africa}

        console.log(this.state);
    }

    shapeSelected(args) {
        let shape2 = args.shapeData.name;
        if (this.mapInstance.baseLayerIndex === 0 && !touchmove) {
            window.location.href=`/country/${shape2} `;
        }
        touchmove = false;
    }
    render() {
        return (<div className='control-pane'>
            <style>
                {SAMPLE_CSS}
            </style>

            <div className='control-section row'>

                <div className=' '>

                    <MapsComponent id="maps" ref={m => this.mapInstance = m} loaded={this.loaded} load={this.load} shapeSelected={this.shapeSelected.bind(this)} zoomSettings={{
                        enable: false
                    }}
                        mapsArea={{
                            background: '#eb9f79 '
                        }}>
                        <Inject services={[Selection, Highlight, MapsTooltip]} />
                        <LayersDirective>

                            <LayerDirective shapeData={this.maps[this.state.continent]} layerType='Geometry' shapeSettings={{
                                fill: '#4d2121',
                                border: {
                                    color: '#faccb6',
                                    width: 0.5
                                }
                            }} highlightSettings={{
                                enable: true,
                                fill: '#faccb6'
                            }} tooltipSettings={{
                                visible: true,
                                valuePath: 'name'
                            }}>
                            </LayerDirective>
                            
                        </LayersDirective>
                    </MapsComponent>
                </div>

            </div>
        </div>);
    }
}

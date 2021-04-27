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
let markers = [
    { name: 'Asia', latitude: 50.32087157990324, longitude: 90.015625 },
    { name: 'Australia', latitude: -23.88583769986199, longitude: 134.296875 },
    { name: 'Africa', latitude: 16.97274101999902, longitude: 16.390625 },
    { name: 'Europe', latitude: 49.95121990866204, longitude: 18.468749999999998 },
    { name: 'North America', latitude: 59.88893689676585, longitude: -109.3359375 },
    { name: 'South America', latitude: -6.64607562172573, longitude: -54.54687499999999 }
];
let touchmove;
export default class MapWorld extends SampleBase {
    change() {
        this.mapInstance.baseLayerIndex = 0;
        this.mapInstance.refresh();
        let button = document.getElementById('button');
        button.style.display = 'none';
        document.getElementById('category').style.visibility = 'hidden';
        document.getElementById('text').innerHTML = '';
        document.getElementById('symbol').style.visibility = 'hidden';
    }
    shapeSelected(args) {
        let shape = args.shapeData.continent;
        let shape2 = args.shapeData.name;
        if (this.mapInstance.baseLayerIndex === 0 && !touchmove) {
            if (shape === 'Africa') {
                this.mapInstance.baseLayerIndex = 1;
                this.mapInstance.refresh();
            }
            else if (shape === 'Europe') {
                this.mapInstance.baseLayerIndex = 2;
                this.mapInstance.refresh();
            }
            else if (shape === 'Asia') {
                this.mapInstance.baseLayerIndex = 3;
                this.mapInstance.refresh();
            }
            else if (shape === 'North America') {
                this.mapInstance.baseLayerIndex = 4;
                this.mapInstance.refresh();
            }
            else if (shape === 'South America') {
                this.mapInstance.baseLayerIndex = 5;
                this.mapInstance.refresh();
            }
            else if (shape === 'Australia') {
                this.mapInstance.baseLayerIndex = 6;
                this.mapInstance.refresh();
            }
            let button = document.getElementById('button');
            button.style.display = 'block';
            document.getElementById('category').style.visibility = 'visible';
            document.getElementById('text').innerHTML = shape;
            document.getElementById('symbol').style.visibility = 'visible';
        }else{
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
                <div id="button" className="backLabel">
                    <a id="category" onClick={this.change.bind(this)} style={{ visibility: 'hidden', display: 'inline-block', fontsize: 16 }}>
                        <h5>WorldMap</h5>
                    </a>
                    <p style={{ visibility: 'hidden', display: 'inline-block' }} id="symbol">&nbsp;&gt;&gt;&nbsp;</p>
                    <p id="text" style={{ display: 'inline-block', fontSize: 16 }}></p>
                </div>


                <div className=' '>

                    <MapsComponent id="maps" ref={m => this.mapInstance = m} loaded={this.loaded} load={this.load} shapeSelected={this.shapeSelected.bind(this)} zoomSettings={{
                        enable: false
                    }}
                        mapsArea={{
                            background: '#eb9f79 '
                        }}>
                        <Inject services={[Selection, Highlight, MapsTooltip]} />
                        <LayersDirective>
                            <LayerDirective shapeData={world} layerType='Geometry' shapePropertyPath='continent' shapeDataPath='continent' dataSource={datasource.default} shapeSettings={{
                                fill: '#4d2121',
                                border: {
                                    color: '#faccb6',
                                    width: 0.5
                                }
                            }} selectionSettings={{
                                enable: false
                            }} tooltipSettings={{
                                visible: true,
                                valuePath: 'continent'
                            }}>
                                <MarkersDirective>
                                    <MarkerDirective visible={true} template='<div style="font-size: 12px;color:white;text-shadow: 0px 1px 1px black;font-weight: 500;width:50px">{{:name}}</div>' animationDuration={0} dataSource={markers}>
                                    </MarkerDirective>
                                </MarkersDirective>
                            </LayerDirective>
                            <LayerDirective shapeData={africa} layerType='Geometry' shapeSettings={{
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
                            <LayerDirective shapeData={europe} layerType='Geometry' shapeSettings={{
                                fill: '#4d2121',
                                border: {
                                    color: '#faccb6',
                                    width: 0.5
                                }
                            }} tooltipSettings={{
                                visible: true,
                                valuePath: 'name'
                            }}
                            >
                            </LayerDirective>
                            <LayerDirective shapeData={asia} layerType='Geometry' shapeSettings={{
                               fill: '#4d2121',
                               border: {
                                   color: '#faccb6',
                                   width: 0.5
                               }
                            }} highlightSettings={{
                                enable: true,
                                fill: '#5e2c2c'
                            }} tooltipSettings={{
                                visible: true,
                                valuePath: 'name'
                            }}>
                            </LayerDirective>
                            <LayerDirective shapeData={northamerica} layerType='Geometry' shapeSettings={{
                               fill: '#4d2121',
                               border: {
                                   color: '#faccb6',
                                   width: 0.5
                               }
                            }} highlightSettings={{
                                enable: true,
                                fill: '#5e2c2c'
                            }} tooltipSettings={{
                                visible: true,
                                valuePath: 'name'
                            }}>
                            </LayerDirective>
                            <LayerDirective shapeData={southamerica} layerType='Geometry' shapeSettings={{
                                fill: '#4d2121',
                                border: {
                                    color: '#faccb6',
                                    width: 0.5
                                }
                            }} highlightSettings={{
                                enable: true,
                                fill: '#5e2c2c'
                            }} tooltipSettings={{
                                visible: true,
                                valuePath: 'name'
                            }}>
                            </LayerDirective>
                            <LayerDirective shapeData={oceania} layerType='Geometry' shapeSettings={{
                                fill: '#4d2121',
                                border: {
                                    color: '#faccb6',
                                    width: 0.5
                                }
                            }} highlightSettings={{
                                enable: true,
                                fill: '#5e2c2c'
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
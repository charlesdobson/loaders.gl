import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Font, Color} from './styles';
import {Checkbox, CheckboxOption, CheckboxSpan} from './checkbox';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleDown, faCircle} from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from './toggle-switch';

const BuildingExplorerContainer = styled.div`
  height: ${(props) => (props.isShown ? '450px' : '40px')};
  overflow: auto;
  align-items: flex-start;
  position: absolute;
  top: 109px;
  display: flex;
  flex-direction: column;
  background: #0e111a;
  border-radius: 8px;
  padding-top: 4px;
  @media (max-width: 768px) {
    top: 63px;
    width: 100%;
    border-radius: 0;
  }
`;

const BuildingExplorerSublayers = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollapseContainer = styled.div`
  margin-right: 5px;
  cursor: pointer;
`;

const CheckboxContainer = styled.div`
  ${Color}
  ${Font}
  margin-left: 10px;
`;

const Label = styled.h3`
  margin: 0 16px 8px 16px;
  cursor: pointer;
  color: white;
  font-weight: normal;
`;

const propTypes = {
  sublayers: PropTypes.array,
  onToggleBuildingExplorer: PropTypes.func,
  isShown: PropTypes.bool
};
const defaultProps = {
  sublayers: [],
  isShown: false
};

export default class BuildingExplorer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      updateCounter: 0
    };
    this._setChild = this._setChild.bind(this);
    this._setChildren = this._setChildren.bind(this);
    this._toggleSublayer = this._toggleSublayer.bind(this);
    this._renderSublayers = this._renderSublayers.bind(this);
  }

  _setChild(sublayer, isShown) {
    const {onUpdateSublayerVisibility} = this.props;
    sublayer.visibility = isShown;
    onUpdateSublayerVisibility(sublayer);
    this._setChildren(sublayer.sublayers, isShown);
  }

  _setChildren(sublayers, isShown) {
    if (sublayers) {
      for (const sublayer of sublayers) {
        this._setChild(sublayer, isShown);
      }
    }
  }

  _toggleSublayer(sublayer) {
    const {onUpdateSublayerVisibility} = this.props;
    sublayer.visibility = !sublayer.visibility;
    onUpdateSublayerVisibility(sublayer);
    this._setChildren(sublayer.sublayers, sublayer.visibility);
    this.setState({updateCounter: this.state.updateCounter + 1});
  }

  _toggleGroup(sublayer) {
    sublayer.expanded = !sublayer.expanded;
    this.setState({updateCounter: this.state.updateCounter + 1});
  }

  _renderSublayers(sublayers) {
    return sublayers.map((sublayer) => {
      const childLayers = sublayer.sublayers || [];
      let icon = faCircle;
      let size = 'xs';
      if (sublayer.sublayers) {
        size = 'lg';
        if (sublayer.expanded) {
          icon = faAngleDown;
        } else {
          icon = faAngleRight;
        }
      }
      return (
        <CheckboxContainer key={sublayer.id}>
          <CheckboxOption>
            <CollapseContainer>
              <FontAwesomeIcon
                icon={icon}
                onClick={() => this._toggleGroup(sublayer)}
                size={size}
              />
            </CollapseContainer>
            <label>
              <Checkbox
                id={`CheckBox${sublayer.id}`}
                value={sublayer.visibility}
                checked={sublayer.visibility}
                onChange={() => this._toggleSublayer(sublayer)}
              />
              <CheckboxSpan>{sublayer.name}</CheckboxSpan>
            </label>
          </CheckboxOption>
          {sublayer.expanded ? this._renderSublayers(childLayers) : null}
        </CheckboxContainer>
      );
    });
  }

  render() {
    const {sublayers, onToggleBuildingExplorer, isShown} = this.props;
    return (
      <BuildingExplorerContainer isShown={isShown}>
        <CheckboxOption style={{marginRight: '16px', paddingBottom: 0}}>
          <Label htmlFor="BuildingExplorerToggle">BuildingExplorer</Label>
          <ToggleSwitch
            id="BuildingExplorerToggle"
            value={isShown}
            checked={isShown}
            onChange={() => {
              if (onToggleBuildingExplorer) {
                onToggleBuildingExplorer(!isShown);
              }
            }}
          />
        </CheckboxOption>
        {isShown ? (
          <BuildingExplorerSublayers>{this._renderSublayers(sublayers)}</BuildingExplorerSublayers>
        ) : null}
      </BuildingExplorerContainer>
    );
  }
}

BuildingExplorer.propTypes = propTypes;
BuildingExplorer.defaultProps = defaultProps;

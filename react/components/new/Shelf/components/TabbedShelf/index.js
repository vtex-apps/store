import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import React, { Fragment, Component } from 'react'
import Button from '../../../Styleguide/Button'
import { withRuntimeContext } from 'vtex.render-runtime'
import Tabs from './Tabs'
import Shelf from '../../Shelf'
import withCssHandles from '../../../CssHandles/withCssHandles'
import tabbedShelf from './tabbedShelf.css'

const MAX_NUMBER_OF_MENUS = 6
const CSS_HANDLES = ['headline'] 

/**
 * Tabbed Shelf Module
 */
class TabbedShelf extends Component {

    /**
     * The prop types for this component
     * Used for type checking
     */
    static propTypes = {
        isEnabled: PropTypes.bool,
        headline: PropTypes.string,
        bottomText: PropTypes.string,
        tabs: PropTypes.PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number,
          __editorItemTitle: PropTypes.string,
        })),
        shelf: PropTypes.object,
    };

    /**
     * Default prop types for this component
     */
    static defaultProps = {
        isEnabled: false,
        headline: '',
        bottomText: '',
        tabs: [],
        shelf: {},
    };

    /**
     * Handle primary call to action button click
     */
    handleButtonClick(url) {
        if(url != undefined && url != '') {
            window.open(url.buttunUrl,"_self");
        }
    }

    /**
     * Return the component
     *
     * @returns {*}
     */
    render() {
        const {
            isEnabled,
            headline,
            bottomText,
            buttunUrl,
            buttonText,
            tabs,
            cssHandles
        } = this.props

        const panes = (tabs.length > 0 ? tabs.map(tab => (
            { menuItem: tab.__editorItemTitle, render: () => (
              <Shelf
                {...{ ...this.props.shelf }}
                category={tab.id}
              />
            )
            }
        )) : '');

        return (
            <Fragment>
                {isEnabled ? (
                    <div className={`${tabbedShelf.container}`}>
                        <h3 className={`${cssHandles.headline}`}>{headline}</h3>
                          <Tabs panes={panes} />
                        <div className={`${tabbedShelf.blockContainer}`}>
                            <p className={`${tabbedShelf.blockText}`}>{bottomText}</p>
                            {buttonText ? (
                                <div className={`${tabbedShelf.buttonContainer}`}>
                                  <Button onClick={() => this.handleButtonClick({buttunUrl})}>{buttonText}</Button>
                                </div>
                            ) : ('')}
                        </div>
                    </div>
                ) : null
                }
            </Fragment>
        );
    }
}

/**
 * Schema for component to allow configuration of props from admin configuration
 */
TabbedShelf.getSchema = props => ({
    title: 'admin/editor.tabbed-shelf.title',
    description: 'admin/editor.tabbed-shelf.description',
    type: 'object',
    properties: {
        isEnabled: {
            title: 'admin/editor.tabbed-shelf.isEnabled.title',
            type: 'boolean',
            default: false,
        },
        headline: {
            title: 'admin/editor.tabbed-shelf.headline',
            type: 'string',
        },
        bottomText: {
            title: 'admin/editor.tabbed-shelf.bottomText',
            type: 'string',
            widget: {
                'ui:widget': 'textarea',
            },
        },
        buttonText: {
            title: 'admin/editor.tabbed-shelf.buttonText',
            type: 'string',
        },
        buttunUrl: {
            title: 'admin/editor.tabbed-shelf.buttonUrl',
            type: 'string',
        },
        tabs: {
            title:'admin/editor.tabbed-shelf.tabs',
            type: 'array',
            minItems: 0,
            maxItems: MAX_NUMBER_OF_MENUS,
            items: {
                title: 'admin/editor.tabbed-shelf.tabs.items',
                type: 'object',
                properties: {
                    id: {
                        title: 'admin/editor.tabbed-shelf.tabs.items.id',
                        type: 'number',
                    },
                },
            },
        },
        shelf: {
          title: 'admin/editor.tabbed-shelf.shelf.title',
          type: 'object',
          properties: Shelf.getSchema(props).properties,
        },
    },
});

export default withRuntimeContext(injectIntl(withCssHandles(CSS_HANDLES)(TabbedShelf)))

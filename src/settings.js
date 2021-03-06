/***************************************************************************************************************************************************************
 *
 * Get settings and merge with defaults
 *
 * SETTINGS     - Keeping our settings across multiple imports
 * SETTINGS.get - Getting our settings
 * SETTINGS.set - Merge with default settings
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';


/**
 * Keeping our settings across multiple imports
 *
 * @type {Object}
 */
export const SETTINGS = {
	/**
	 * The default settings
	 *
	 * @type {Object}
	 */
	defaults: {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>', // https://github.com/facebook/react/issues/1035
			redirectReact: true,
			markdownRenderer: '',
		},
		docs: {
			root: 'files/',
			index: Path.normalize(`${ __dirname }/../.template/docs/layout/index.js`),
			category: Path.normalize(`${ __dirname }/../.template/docs/layout/category.js`),
			IDProp: 'page2',
			navProp: {
				index: {
					page1: 'page1',
					page2: {
						'page2/nested': 'page2/nested',
					},
					page3: 'page3',
				},
			},
			pagesProp: {
				page1: {
					url: '/page1',
					title: 'Page 1',
				},
				page2: {
					url: '/page2',
					title: 'Page 2',
				},
				'page2/nested': {
					url: '/page2/nested',
					title: 'Nested in page 2',
				},
				page3: {
					url: '/page3',
					title: 'Page 3',
				},
				index: {
					url: '/',
					title: 'Homepage',
				},
			},
		},
	},


	/**
	 * Getting our settings
	 *
	 * @return {object} - The settings object
	 */
	get: () => {
		return SETTINGS.defaults;
	},


	/**
	 * Merge with default settings
	 *
	 * @param  {object} localSettings - The new settings object to be merged
	 *
	 * @return {object}               - Our new settings
	 */
	set: ( localSettings ) => {
		Log.verbose(`Merging default setting with`);
		Log.verbose( Style.yellow( JSON.stringify( localSettings ) ) );

		if( localSettings ) {
			if( !localSettings.folder ) {
				localSettings.folder = {};
			}
			if( !localSettings.layouts ) {
				localSettings.layouts = {};
			}
			if( !localSettings.site ) {
				localSettings.site = {};
			}
			if( !localSettings.docs ) {
				localSettings.docs = {};
			}

			delete localSettings.folder.cwd; // ignore the cwd key

			// let’s make them absolute
			if( localSettings.folder.content && !Path.isAbsolute( localSettings.folder.content ) ) {
				localSettings.folder.content = Path.normalize(`${ process.cwd() }/${ localSettings.folder.content }/`);
			}
			if( localSettings.folder.src && !Path.isAbsolute( localSettings.folder.src ) ) {
				localSettings.folder.src = Path.normalize(`${ process.cwd() }/${ localSettings.folder.src }/`);
			}
			if( localSettings.folder.site && !Path.isAbsolute( localSettings.folder.site ) ) {
				localSettings.folder.site = Path.normalize(`${ process.cwd() }/${ localSettings.folder.site }/`);
			}
			if( localSettings.folder.docs && !Path.isAbsolute( localSettings.folder.docs ) ) {
				localSettings.folder.docs = Path.normalize(`${ process.cwd() }/${ localSettings.folder.docs }/`);
			}
			if( localSettings.folder.assets && !Path.isAbsolute( localSettings.folder.assets ) ) {
				localSettings.folder.assets = Path.normalize(`${ process.cwd() }/${ localSettings.folder.assets }/`);
			}

			if( localSettings.docs.index && !Path.isAbsolute( localSettings.docs.index ) ) {
				localSettings.docs.index = Path.normalize(`${ process.cwd() }/${ localSettings.docs.index }`);
			}
			if( localSettings.docs.category && !Path.isAbsolute( localSettings.docs.category ) ) {
				localSettings.docs.category = Path.normalize(`${ process.cwd() }/${ localSettings.docs.category }`);
			}

			const newSettings = {};

			newSettings.folder = Object.assign( SETTINGS.defaults.folder, localSettings.folder );
			newSettings.layouts = Object.assign( SETTINGS.defaults.layouts, localSettings.layouts );
			newSettings.site = Object.assign( SETTINGS.defaults.site, localSettings.site );
			newSettings.docs = Object.assign( SETTINGS.defaults.docs, localSettings.docs );

			SETTINGS.defaults = newSettings;

			Log.verbose(`New settings now:`);
			Log.verbose( Style.yellow( JSON.stringify( newSettings ) ) );

			return newSettings;
		}
		else {
			return SETTINGS.get();
		}
	},
};

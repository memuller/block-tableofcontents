<?php
/**
 * Plugin Name: block-tableofcontents
 * Plugin URI: https://github.com/memuller/block-tableofcontents
 * Description: a Wordpress block with links to post headings.
 * Author: Matheus E. Muller
 * Author URI: https://memuller.com/
 * Version: 0.1.1
 * License: GPL3
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';

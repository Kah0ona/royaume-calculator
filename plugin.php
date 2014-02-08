<?php
/*
Plugin Name: royaume calculator 
Plugin URI: http://www.lokaalgevonden.nl
Description: This plugin provides a calculator for estimates for Royaume facility
Version: 1.0
Author: Marten Sytema
Author URI: http://www.lokaalgevonden.nl
Author Email: marten@sytematic.nl
License:

  Copyright 2013 Sytematic Software (marten@sytematic.nl)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as 
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
  
*/

class CalculatorPlugin {
	protected $to = 'marten@sytematic.nl';

	/**
	 * Initializes the plugin by setting localization, filters, and administration functions.
	 */
	function __construct() {
		session_start();
		add_shortcode('calculator', array($this, 'render_calculator_package'));
		add_shortcode('calculator_hourly', array($this, 'render_calculator_hourly'));
		add_action('wp_enqueue_scripts', array( $this, 'register_plugin_styles' ) );
		add_action('wp_enqueue_scripts', array( $this, 'register_plugin_scripts' ) );

		if(is_admin()){
			add_action('wp_ajax_nopriv_processcalc',array($this,'process'));			
			add_action('wp_ajax_processcalc',array($this,'process'));		
		}
	}

	public function process(){
		$post = $_POST;


		$headers = 'MIME-Version: 1.0' . "\r\n".
				   'Content-type: text/html; charset=UTF-8' . "\r\n".
				   'From: '.$post['personal']['E-mail']."\r\n" .
				   'Reply-To: '.$this->to. "\r\n" .
				   'Cc: '.$post['personal']['E-mail']."\r\n".
				   'X-Mailer: PHP/' . phpversion();			
		
		$mail = $this->buildMail($post);
		mail($this->to, 'Ingezonden offerte-aanvraag', $mail, $headers);
		mail($post['personal']['E-mail'], 'Uw aanvraag bij Royaume Facility', $mail, $headers);
		echo '{"status" : "OK"}';
		die();
	}	
	public function buildMail($post){
		$ret = ''.$post['html'];
		return $ret;
	}


	public function register_plugin_scripts(){
		wp_enqueue_script('rc-model', plugins_url('/royaume-calculator/model.js'), array('jquery')); 
		wp_enqueue_script('rc-view', plugins_url('/royaume-calculator/view.js'), array('jquery', 'rc-model')); 
		wp_enqueue_script('rc-controller', plugins_url('/royaume-calculator/controller.js'), array('jquery', 'rc-view')); 
	}

	public function register_plugin_styles(){
		wp_enqueue_style( 'rc-styles', plugins_url( '/royaume-calculator/style.css' ));
	}
	public function render_calculator_package() {
		$this->render_calculator('PACKAGE');
	}
	public function render_calculator_hourly(){
		$this->render_calculator('HOURLY');
	}
	public function render_calculator($type='PACKAGE'){ ?>
		<script>
			jQuery(document).ready(function($){
				window.app.model.init({
					submitUrl : "<?php echo admin_url('admin-ajax.php'); ?>",
					calculatorMode : app.model.calculatormode.<?php echo $type; ?>
				});	
				
				window.app.controller.init();
				window.app.controller.render();
			});	
		</script>
		<div class="row-fluid">
			<div id="calculator" class="span12">
				<div id="roomselection_screen" class="appScreen" style="display:none;"></div>
				<div id="agenda_screen" class="appScreen" style="display:none"></div>
				<div id="pricecalc_screen" class="appScreen" style="display:none"></div>
				<div id="personaldetails_screen" class="appScreen" style="display:none;"></div>
				<div id="submit_screen" class="appScreen" style="display:none;"></div>
				<div id="thank_you_screen" class="appScreen" style="display:none;"></div>
			</div>
		</div>
	<?php
   	}
}

$calculatorPlugin = new CalculatorPlugin();
?>

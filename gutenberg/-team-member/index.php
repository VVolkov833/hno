<?php

defined( 'ABSPATH' ) || exit;

// FirmCatalyst Plugin Gutenberg Block..
class FCPTeamMember {
    private $name = 'team-member';

    public function __construct() {
        add_action( 'init', [$this, 'registerBlock'] );
        //add_action( 'wp_enqueue_scripts', [$this, 'conditionalStyle'] );
    }


    public function registerBlock() {

        register_block_type( 'fcp-gutenberg/'.$this->name, [
            'editor_script' => 'fcpgb-'.$this->name.'-adm',
            //'editor_style' => 'fcpgb-'.$this->name.'-adm',
            'render_callback' => [$this, 'printBlock']
        ] );
    
        wp_register_script(
            'fcpgb-'.$this->name.'-adm',
            plugins_url( 'block.js', __FILE__ ),
            ['wp-blocks', 'wp-element', 'wp-block-editor', 'underscore'],
            filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
        );
        
        if ( is_file( plugin_dir_path( __FILE__ ) . 'editor.css' ) ) {
            wp_register_style(
                'fcpgb-'.$this->name.'-adm',
                plugins_url( 'editor.css', __FILE__ ),
                ['wp-edit-blocks'],
                filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
            );
        }

    }


    public function printBlock($props) {
        ob_start();

?>

    <div class="fcp-team-member">
        <div class="fcp-member-avatar-wrap">
            <div
                class="fcp-member-avatar" <?php echo $props['mediaID'] ?
                    'style="background-image:url('.wp_get_attachment_image_url($props['mediaID'], 'medium').')"' :
                    '' ?>
            >
                <?php echo wp_get_attachment_image( $props['mediaID'], 'medium' ) ?>
            </div>
        </div>
        <h5 class="fcp-member-name">
            <?php echo $props['full_name'] ?>
        </h5>
        <div class="fcp-member-position">
            <?php echo $props['position'] ?>
        </div>
        <div class="fcp-member-socials">
            <?php
                $socials = ['email', 'xing', 'linkedin', 'github', 'stackoverflow', 'deviantart', 'personal_page'];
                foreach ( $socials as $v ) {
                    if ( empty( $props[$v] ) ) {
                        continue;
                    }

                    if ( $v == 'email' ) {
                        $props[$v] = 'mailto:' . str_replace( 'mailto:', '', $props[$v] );
                    }
                    
                    ?>
                    <a
                        href="<?php echo $props[$v] ?>" class="fcp-i-<?php echo $v ?>" title="<?php echo $v ?>"
                        rel="nofollow noopener noreferrer" target="_blank"
                    ></a>
                    <?php
                }
            ?>
        </div>
    </div>

<?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }

    public function conditionalStyle($content) {

        if ( !has_block( 'fcp-gutenberg/'.$this->name, get_the_ID() ) ) {
            return $content;
        }

        if ( !is_file( plugin_dir_path( __FILE__ ) . 'style.css' ) ) {
            return $content;
        }
        
            
        wp_enqueue_style( 'fcpgb-'.$this->name,
            plugins_url( 'style.css', __FILE__ ),
            false,
            filemtime( plugin_dir_path( __FILE__ ) . 'style.css' ),
            'all'
        );

        return $content;
    }
    
}

new FCPTeamMember();

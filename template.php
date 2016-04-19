<?php

function tania_preprocess_page(&$vars) {
    global $language;
    drupal_add_css(path_to_theme() . '/dist/css/style-'.$language->dir.'.css');
}

function tania_html_head_alter(&$head_elements) {
    unset($head_elements['system_meta_generator']);

    $head_elements['viewport'] = array(
        '#type' => 'html_tag',
        '#tag' => 'meta',
        '#attributes' => array('name' => 'viewport', 'content' => 'width=device-width, initial-scale=1'),
    );
}

function tania_textarea($variables) {
    $element = $variables['element'];
    element_set_attributes($element, array('id', 'name', 'cols', 'rows'));
    _form_set_class($element, array('form-textarea', 'form-control'));

    $wrapper_attributes = array(
        'class' => array('form-textarea-wrapper'),
    );

    // Add resizable behavior.
    if (!empty($element['#resizable'])) {
        drupal_add_library('system', 'drupal.textarea');
        $wrapper_attributes['class'][] = 'resizable';
    }

    $output = '<div' . drupal_attributes($wrapper_attributes) . '>';
    $output .= '<textarea' . drupal_attributes($element['#attributes']) . '>' . check_plain($element['#value']) . '</textarea>';
    $output .= '</div>';
    return $output;
}

function tania_textfield($variables) {
    $element = $variables['element'];
    $element['#attributes']['type'] = 'text';
    element_set_attributes($element, array('id', 'name', 'value', 'size', 'maxlength'));
    _form_set_class($element, array('form-text', 'form-control'));

    $extra = '';
    if ($element['#autocomplete_path'] && !empty($element['#autocomplete_input'])) {
        drupal_add_library('system', 'drupal.autocomplete');
        $element['#attributes']['class'][] = 'form-autocomplete';

        $attributes = array();
        $attributes['type'] = 'hidden';
        $attributes['id'] = $element['#autocomplete_input']['#id'];
        $attributes['value'] = $element['#autocomplete_input']['#url_value'];
        $attributes['disabled'] = 'disabled';
        $attributes['class'][] = 'autocomplete';
        $extra = '<input' . drupal_attributes($attributes) . ' />';
    }

    $output = '<input' . drupal_attributes($element['#attributes']) . ' />';

    return $output . $extra;
}

function tania_password($variables) {
    $element = $variables['element'];
    $element['#attributes']['type'] = 'password';
    element_set_attributes($element, array('id', 'name', 'size', 'maxlength'));
    _form_set_class($element, array('form-text', 'form-control'));

    return '<input' . drupal_attributes($element['#attributes']) . ' />';
}

function tania_button($variables) {
    $element = $variables['element'];
    $element['#attributes']['type'] = 'submit';
    element_set_attributes($element, array('id', 'name', 'value'));

    $element['#attributes']['class'][] = 'btn';
    $element['#attributes']['class'][] = 'btn-default';

    $element['#attributes']['class'][] = 'form-' . $element['#button_type'];

    if (!empty($element['#attributes']['disabled'])) {
        $element['#attributes']['class'][] = 'form-button-disabled';
    }

    return '<input' . drupal_attributes($element['#attributes']) . ' />';
}

function tania_status_messages($variables) {
    $display = $variables['display'];
    $output = '';

    $status_heading = array(
        'status' => t('Status message'),
        'error' => t('Error message'),
        'warning' => t('Warning message'),
    );

    $status_class = array(
        'status' => 'success',
        'error' => 'danger',
        'warning' => 'warning',
    );

    foreach (drupal_get_messages($display) as $type => $messages) {
        $output .= "<div class=\"alert alert-$status_class[$type]\">\n";
        $output .= "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
        if (!empty($status_heading[$type])) {
            $output .= '<h2 class="element-invisible">' . $status_heading[$type] . "</h2>\n";
        }
        if (count($messages) > 1) {
            $output .= " <ul>\n";
            foreach ($messages as $message) {
                $output .= '  <li>' . $message . "</li>\n";
            }
            $output .= " </ul>\n";
        }
        else {
            $output .= reset($messages);
        }
        $output .= "</div>\n";
    }
    return $output;
}

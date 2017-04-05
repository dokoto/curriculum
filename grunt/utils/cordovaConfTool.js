'use strict';

const misc = require('./misc');
const fs = require('fs');
const xmldom = require('xmldom');

class CordorvaConfTool {
    constructor(grunt, xmlPath, nodes) {
        this.xmlPath = xmlPath;
        this.nodes = nodes;
        this.xmlObject = null;
        this.options = grunt.config.data;
        this.grunt = grunt;
        this.xmlString = null;
    }

    _addAttributes(that, el, node) {
        if (node.attributes !== undefined) {
            let attributeIndex, attribute, value;
            for (attributeIndex = 0; attributeIndex < node.attributes.length; attributeIndex++) {
                attribute = node.attributes[attributeIndex];
                value = misc.resolveComplexVal(this.grunt, this.options, attribute.value);
                if (typeof value !== 'string' && typeof value !== 'number') {
                    this.grunt.fatal('[_addAttributes] Complex value resolution error valueToResolv :' + JSON.stringify(attribute.value) + ' valureResolved: ' + value);
                }
                el.setAttribute(attribute.key, value);
            }
        }
    }

    _resolveFather(node, father) {
        this.grunt.verbose.writeln('[RESOLVE_FATHER]');
        this.grunt.verbose.writeln('[RESOLVE_FATHER] INIT');
        if (father === undefined) {
            if (node.nodeFather instanceof Object) {
                this.grunt.verbose.writeln('[RESOLVE_FATHER] ' + node.nodeFather.tag);
                let tags = this.xmlObject.getElementsByTagName(node.nodeFather.tag);
                for (let tag = 0; tag < tags.length; tag++) {
                    this.grunt.verbose.writeln('[RESOLVE_FATHER] ' + tags[tag]);
                    let attrs = node.nodeFather.attributes;
                    let match = (attrs.length && attrs.length > 0) ? true : false;
                    for (let attr = 0; attr < attrs.length; attr++) {
                        this.grunt.verbose.writeln('[RESOLVE_FATHER] ' + attrs[attr].key + ' | ' + attrs[attr].value);
                        if (tags[tag].getAttribute(attrs[attr].key) !== attrs[attr].value) {
                            match = false;
                            break;
                        }
                    }
                    if (match === true) {
                        return tags[tag];
                    }
                }
            } else {
                this.grunt.verbose.writeln('[RESOLVE_FATHER] STRING ' + node.nodeFather);
                return this.xmlObject.getElementsByTagName(node.nodeFather)[0];
            }
        } else {
            return father;
        }
    }

    _createNewNode(that, node, father) {
        let i;
        let new_el = this.xmlObject.createElement(node.nodeName);
        if (node.value !== undefined) {
            let text = misc.resolveComplexVal(this.grunt, this.options, node.value);
            if (typeof text !== 'string' && typeof text !== 'number') {
                this.grunt.fatal('[_createNewNode] Complex value resolution error valueToResolv :' + JSON.stringify(node.value) + ' valureResolved: ' + text);
            }
            this.grunt.verbose.writeln('[CREATE] Node: ' + node.nodeName + ' Value: ' + text);
            let new_text = this.xmlObject.createTextNode(text);
            new_el.appendChild(new_text);
        }
        //var el = (father === undefined) ? xmlObject.getElementsByTagName(node.nodeFather)[0] : father;
        let el = this._resolveFather(node, father);
        el.appendChild(new_el);
        this._addAttributes(that, new_el, node);
        if (node.childs !== undefined) {
            for (i = 0; i < node.childs.length; i++) {
                this._createNewNode(that, node.childs[i], new_el);
            }
        }
    }

    // Solo funciona si solo existe una etiqueta con ese nombre
    _modifyNode(that, node) {
        let i;
        let el = this.xmlObject.getElementsByTagName(node.nodeName)[0];
        if (el === undefined) {
            this.grunt.verbose.writeln('WARN !!! NodeName: "' + node.nodeName + '" no exists, but is marked as modify node ??. Skipping');
            return;
        }
        if (node.value !== undefined) {
            let new_text = el.childNodes[0];
            let text = misc.resolveComplexVal(this.grunt, this.options, node.value);
            if (typeof text !== 'string' && typeof text !== 'number') {
                this.grunt.fatal('[_modifyNode] Complex value resolution error valueToResolv :' + JSON.stringify(node.value) + ' valureResolved: ' + text);
            }
            this.grunt.verbose.writeln('[MODIFY] Node: ' + JSON.stringify(node.value) + ' Value: ' + text);
            new_text.nodeValue = text;
            new_text.data = text;
        }
        this._addAttributes(that, el, node);
        if (node.childs !== undefined) {
            var el_father = this.xmlObject.getElementsByTagName(node.nodeFather)[0];
            for (i = 0; i < node.childs.length; i++) {
                this._createNewNode(that, node.childs[i], el);
            }
        }
    }

    _editXML(nodes) {
        if (nodes.toCreate !== undefined) {
            for (let nodeIndex = 0; nodeIndex < nodes.toCreate.length; nodeIndex++) {
                this.grunt.verbose.writeln('CREATING NodeName: ' + nodes.toCreate[nodeIndex].nodeName);
                this._createNewNode(this, nodes.toCreate[nodeIndex]);
            }
        }

        if (nodes.toModify !== undefined) {
            for (let nodeIndex = 0; nodeIndex < nodes.toModify.length; nodeIndex++) {
                this.grunt.verbose.writeln('MODIFING NodeName: ' + nodes.toModify[nodeIndex].nodeName);
                this._modifyNode(this, nodes.toModify[nodeIndex]);
            }
        }
    }

    run() {
        try {
            this.xmlString = fs.readFileSync(this.xmlPath, 'utf-8');
            this.xmlObject = new xmldom.DOMParser().parseFromString(this.xmlString);
            this._editXML(this.nodes);
            fs.writeFileSync(this.xmlPath, new xmldom.XMLSerializer().serializeToString(this.xmlObject));
        } catch (error) {
            this.grunt.fatal(error);
        }
    }
}

module.exports = CordorvaConfTool;

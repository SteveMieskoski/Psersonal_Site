define(['require', 'top/data', 'scripts/createPageContent', 'urlHandler', 'store', 'scripts/createNewPage', 'scripts/removePage', 'scripts/tweenAnimate',  'scripts/background_placer'], function (require,  data, createPageContent, urlHandler, store, createNewPage, removePage, tweenAnimate, background_placer) {
    'use strict';
    function PageCreateAndDestroy() {
    }

    PageCreateAndDestroy.prototype = {
        constructor: PageCreateAndDestroy,


        initialPageAdd: function (keepId) {
            var i;
            for (i = 0; i < store().scene.children.length; i++) {
                if (store().scene.children[i].name === Number(keepId)) {
                    store().scene.remove(store().scene.children[i]);
                }
            }
            if (window.innerWidth > window.innerHeight) {
                this.AnimateAddPageObjects(store, keepId);

            } else {
                this.AnimateAddPageObjectsVertical(store, keepId);

            }
        },

        /**
         * remove objects that make up the top level animations and navigation. (i.e. Add Page with Content)
         * and add the HTML and content to fill page background
         * */
        AddPageObjects: function (keepId) {

            //var urlHandler = require('../urlHandler');
            //var store = require('../store');

            urlHandler.checkNavState(data.dataObject, keepId);

            var rendererAttach = document.getElementById('container');

            createNewPage.ClearScene(store, keepId, function () {
                createNewPage.addPageObjects(store, keepId, rendererAttach, function () {
                    createNewPage.addHtmlContent(store, keepId, createPageContent.loadHtmlFile);
                });
            });

            store().camera.position.z = 1000;

            store().renderer.setSize(window.innerWidth, window.innerHeight, true);

            store().renderer.render(store().scene, store().camera); // to c&p

            background_placer();
            // todo solve underlying issue related to view/ camera rendering with close z position. Causing the page to appear zoomed in following menu link from one page to another


        },

        AnimateAddPageObjects: function (store, keepId, fromResize) {

            createNewPage.ClearScene(store, keepId);

            var i, j, objectfly, picked,
                selectFly = [],
                panelPositions = [],
                panelPositionList = [{x: -1000, y: -400}, {x: -1000, y: -200}, {x: -1000, y: 0}, {x: -1000, y: 200}, {x: -1000, y: -600}, {x: 1000, y: -600}, {x: 1000, y: -400}, {x: 1000, y: -200}, {x: 1000, y: 0}];

            for (j = panelPositionList.length - 1; j >= 0; j--) {
                picked = Math.floor(Math.random() * panelPositionList.length);
                panelPositions.push(panelPositionList.splice(picked, 1)[0]);
            }

            for (i = 0; i < store().objects.length; i++) {
                objectfly = new THREE.Object3D();
                if (i === Number(keepId)) {
                    objectfly.position.z = 750;
                    objectfly.rotation.y = Math.PI * 2;
                } else {

                    objectfly.position.x = panelPositions[i].x;
                    objectfly.position.y = panelPositions[i].y;
                    objectfly.position.z = Math.random() - 1000;

                }
                selectFly.push(objectfly);
            }


            if (fromResize) {

                tweenAnimate.Run(store().objects, selectFly, store().scene, store().camera, store().renderer, 2000, [6, 6], keepId, false);
            } else {
                tweenAnimate.Run(store().objects, selectFly, store().scene, store().camera, store().renderer, 2000, [6, 6], keepId, true);
            }

        },


        AnimateAddPageObjectsVertical: function (store, keepId, fromResize) {
            createNewPage.ClearScene(store, keepId);
            var i, j, xFly, objectfly, picked,
                selectFly = [],
                panelPositions = [],
                panelPositionList = [{x: -1000, y: -400}, {x: -1000, y: 0}, {x: -1000, y: 200}, {
                    x: -1000,
                    y: 400
                }, {x: 1000, y: -400}, {x: 1000, y: 0}, {x: 1000, y: 200}, {x: 1000, y: 400}, {x: 1000, y: -600}];
//
            for (j = panelPositionList.length - 1; j >= 0; j--) {
                picked = Math.floor(Math.random() * panelPositionList.length);
                panelPositions.push(panelPositionList.splice(picked, 1)[0]);
            }

            for (i = 0; i < store().objects.length; i++) {
                objectfly = new THREE.Object3D();
                if (i === Number(keepId)) {
                    objectfly.position.z = 750;
                    objectfly.rotation.y = Math.PI * 2;

                } else {
                    xFly = Math.round(Math.random() * 2 - 1);
                    if (Math.abs(xFly) === 0) {
                        xFly = -1;
                    }
                    // todo Had a little hickup with panels remaining in front and not being removed, but no errors were thrown.
                    objectfly.position.x = -290;
                    objectfly.position.y = -i * 180 + 500;
                    objectfly.position.z = Math.random() - 1000;

                }
                selectFly.push(objectfly);
            }

            if (fromResize) {
                tweenAnimate.Run(store().objects, selectFly, store().scene, store().camera, store().renderer, 2000, [6, 6], keepId, false);
            } else {
                tweenAnimate.Run(store().objects, selectFly, store().scene, store().camera, store().renderer, 2000, [6, 6], keepId, true);
            }
        },

        RemoveBackground: function () {
            store().rendererP.render(store().sceneP, store().camera);
        },

        /**
         * return (add back) the objects that made up the top level animations and navigation. (i.e. Remove Page with Content)
         * */
        removePageRebuildMain: function () {
            //var urlHandler = require('urlHandler'),
            var varyTransitions = [store().targets.table, store().targets.sphere, store().targets.helix, store().targets.grid],
                transition = varyTransitions[Math.floor(Math.random()) + Math.floor(Math.random()) + Math.floor(Math.random())];


            removePage.Objects();

            urlHandler.checkNavState();

            removePage.RebuildMainPage(store);

            // todo find a better way to get the rand num

            tweenAnimate.Run(store().objects, transition, store().scene, store().camera, store().renderer, 500, [6, 6]);  //original ease values [22,21]
        }
    };


    return new PageCreateAndDestroy;
});
//=====================NOTES===================================

/*
 Look into possibly incorporating this code as a try to correct the camera issue(s)
 this.camera.target = new THREE.Vector3( 0, 0, 0 );
 this.camera.lookAt( this.camera.target );

 */

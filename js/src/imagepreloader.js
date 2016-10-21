import Emitter from './emitter';
/**
 * ------------------------------------------------------------------------
 * Image preloader
 * example:
 *
 * a = new Preloader([
 * 'https://stopiniceland.is/icloud/images/bokundev/87l1477058801.jpeg?size=550x_',
 * 'https://stopiniceland.is/icloud/images/bokundev/37l1477058511.jpeg?size=550x_',
 * 'https://stopiniceland.is/icloud/images/bokundev/181l1477059083.jpeg?size=550x_'
 * ]);
 *
 * a.on('each', function(rsp) {console.log(rsp)})
 * a.on('done', function(rsp){ console.log(rsp)});
 * ------------------------------------------------------------------------
 */

const Preloader = (() => {

     class Preloader extends Emitter {

         constructor(pathList, options) {
             super();
             this.defaults = {
                 prefix: null
             };
             _.extend(this.defaults, options);

             this.pathList = pathList;
             this.loadedImages = [];
             this.total = this.pathList.length;
             this.counter = 0;
             this.percent = 0;

             this.loadImages();
         }

         loadImages() {
             let self = this;
             for (var i = 0; i < this.pathList.length; i++) {
                 try {
                     var img = this.loadedImages[i] = document.createElement('img');
                     if (this.defaults.prefix) {
                         //add trailing slash if doesn't exists
                         var prefix = this.defaults.prefix.replace(/\/?$/, '/');
                     }
                     else {
                         prefix = '';
                     }

                     img.onload = ()=> {
                         this.counter++;
                         this.percent = (this.counter / this.total) * 100;

                         this.trigger('each', this.counter, this.percent);
                         if (this.counter === this.total) {
                             this.trigger('done', this.loadedImages);
                         }
                     };

                     img.onerror = (err)=> {
                         //prevent component from stoping if last image is not found
                         this.counter++;
                         if (this.total === this.counter) {
                             this.trigger('each', this.counter, 100);
                             this.trigger('done', this.loadedImages);
                         }
                     };
                     img.src = prefix + this.pathList[i];
                 } catch (err) {
                     console.warn(err);
                 }

             }
         }
     }

     return Preloader

})();

export default Preloader;

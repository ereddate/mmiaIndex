// 包装函数
module.exports = function(grunt) {

  // 任务配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        files: [{
          src: ['libs/sea-debug.js', 'libs/jquery.1111.min.js'],
          dest: 'libs/libs.<%= pkg.version %>.js'
        }, {
          src: ['css/reset.css', 'css/page.css'],
          dest: 'dist/css/all.<%= pkg.version %>.css'
        }]
      }
    },
    uglify: {
      dist: {
        options: {
          mangle: false, //不混淆变量名
          preserveComments: false, //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
          footer: '\n/*! <%= pkg.name %> ereddate@gmail.com 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */' //添加footer
        },
        files: [{
          src:"js/config.<%= pkg.version %>.js",
          dest:"dist/js/config.<%= pkg.version %>.min.js"
        }, {
          src: "js/home/home.<%= pkg.version %>.js",
          dest: "dist/js/home/home.<%= pkg.version %>.min.js"
        }, {
          src: 'js/modules/common/common.<%= pkg.version %>.js',
          dest: 'dist/js/modules/common/common.<%= pkg.version %>.min.js'
        }, {
          src: 'js/modules/controls/controls.<%= pkg.version %>.js',
          dest: 'dist/js/modules/controls/controls.<%= pkg.version %>.min.js'
        }, {
          src: 'js/modules/interface/interface.<%= pkg.version %>.js',
          dest: 'dist/js/modules/interface/interface.<%= pkg.version %>.min.js'
        }]
      },
      uglibs: {
        options: {
          footer: '\n/*! <%= pkg.name %> ereddate@gmail.com 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */' //添加footer
        },
        files: {
          "dist/libs/libs.<%= pkg.version %>.min.js": "libs/libs.<%= pkg.version %>.js"
        }
      }
    }
  });

  // 任务加载
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // 自定义任务
  grunt.registerTask('default', ['concat', 'uglify']);

};
var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-generate -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-generate \\[options\\] \\[command\\]',
      '',
      '  Commands:',
      '',
      '    service <name>         Generates a service as <name> within .*services',
      '    services <names>       Generates services specified with <name ...> within .*services',
      '    controller <name>      Generates a controller as <name> within .*controllers',
      '    controllers <names>    Generates controllers specified with <name ...> within .*controllers',
      '    model <name>           Generates a model as <name> within .*models',
      '    models <names>         Generates models specified with <name ...> within .*models',
      '    task <name>            Generates a task as <name> within .*tasks',
      '    tasks <names>          Generates tasks specified with <name ...> within .*tasks',
      '    view <name>            Generates a view as <name> within .*views',
      '    views <names>          Generates views specified with <name ...> within .*views',
      '    factory <name>         Generates a factory as <name> within .*factories',
      '    factories <names>      Generates factories specified with <name ...> within .*factories',
      '    service <name>         Generates a service as <name> within .*services',
      '    services <names>       Generates services specified with <name ...> within .*services',
      '    directive <name>       Generates a directive as <name> within .*directives',
      '    directives <names>     Generates directives specified with <name ...> within .*directives',
      '    test \\[options\\] <name>  Generates a test t as <name> within .*tests',
      '    tests \\[options\\] <names> Generates test specified with <name ...> within .*tests',
      '',
      '  Options:',
      '',
      '    -h, --help     output usage information',
      '    -V, --version  output the version number',
      '',
      '  Example:',
      '',
      '    clever generate model users',
      '    clever generate controller users',
      '    clever g controller users',
      '    clever g controllers users auth email',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}

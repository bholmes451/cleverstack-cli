var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-generate' ) + ' service Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.not.match( /already exists within/ );

    expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'testing2_service.js' ) ) ).to.be.true;

    var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'testing2_service.js' ) );
    expect( service ).to.match( /ng\.module\('testing2.services'\)/ );
    expect( service ).to.match( /\.service\('Testing2Service', \[/ );

    done( err );
  } );
}

exports.tapfail = function ( done ) {
  exec( path.join( binPath, 'clever-generate' ) + ' service Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( /already exists within/ );
    done( err );
  } );
}

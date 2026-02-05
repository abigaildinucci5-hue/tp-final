// backend/src/config/oauth.js
// Configuración de Passport.js para Google y GitHub OAuth

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { ejecutarConsulta } = require('./baseDatos');

/**
 * ========================================
 * CONFIGURACIÓN DE GOOGLE OAUTH
 * ========================================
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔐 Google OAuth - Perfil recibido:', {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          nombre: profile.displayName,
        });

        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const nombre = profile.name?.givenName || 'Usuario';
        const apellido = profile.name?.familyName || 'Google';
        const fotoPerfil = profile.photos?.[0]?.value || null;

        if (!email) {
          return done(new Error('No se pudo obtener el email de Google'), null);
        }

        // 1. Buscar si ya existe usuario con este Google ID
        let usuarios = await ejecutarConsulta(
          'SELECT * FROM usuarios WHERE google_id = ? LIMIT 1',
          [googleId]
        );

        if (usuarios.length > 0) {
          console.log('✅ Usuario existente encontrado por Google ID');
          return done(null, usuarios[0]);
        }

        // 2. Buscar si existe usuario con ese email
        usuarios = await ejecutarConsulta(
          'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
          [email]
        );

        if (usuarios.length > 0) {
          // Vincular cuenta de Google a usuario existente
          console.log('🔗 Vinculando cuenta de Google a usuario existente');
          await ejecutarConsulta(
            'UPDATE usuarios SET google_id = ?, auth_provider = ?, foto_perfil = ? WHERE id_usuario = ?',
            [googleId, 'google', fotoPerfil, usuarios[0].id_usuario]
          );

          const usuarioActualizado = await ejecutarConsulta(
            'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1',
            [usuarios[0].id_usuario]
          );

          return done(null, usuarioActualizado[0]);
        }

        // 3. Crear nuevo usuario con Google
        console.log('➕ Creando nuevo usuario con Google OAuth');

        const resultado = await ejecutarConsulta(
          `INSERT INTO usuarios (nombre, apellido, email, google_id, auth_provider, foto_perfil, verificado, rol) 
           VALUES (?, ?, ?, ?, 'google', ?, TRUE, 'cliente')`,
          [nombre, apellido, email, googleId, fotoPerfil]
        );

        const nuevoUsuario = await ejecutarConsulta(
          'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1',
          [resultado.insertId]
        );

        console.log('✅ Usuario creado exitosamente:', nuevoUsuario[0].email);
        return done(null, nuevoUsuario[0]);

      } catch (error) {
        console.error('❌ Error en Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

/**
 * ========================================
 * CONFIGURACIÓN DE GITHUB OAUTH
 * ========================================
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
      passReqToCallback: true,
      // 🔥 Usar el username como fallback si no hay email
      userProfileURL: 'https://api.github.com/user',
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔐 GitHub OAuth - Perfil recibido:', {
          id: profile.id,
          username: profile.username,
          email: profile.emails?.[0]?.value,
          nombre: profile.displayName,
        });

        // 🔥 Si no hay email, intentar obtenerlo del API de GitHub
        let email = profile.emails?.[0]?.value;
        
        if (!email) {
          console.log('⚠️ No hay email en el perfil, intentando obtenerlo del API de GitHub...');
          try {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
              headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });

            if (emailResponse.ok) {
              const emails = await emailResponse.json();
              console.log('📧 Emails obtenidos del API:', emails.map(e => ({ email: e.email, primary: e.primary, verified: e.verified })));
              
              // Usar el email primario y verificado
              const primaryEmail = emails.find(e => e.primary && e.verified);
              email = primaryEmail?.email || emails[0]?.email;
              
              if (email) {
                console.log('✅ Email obtenido del API:', email);
              }
            }
          } catch (fetchError) {
            console.warn('⚠️ Error obteniendo emails del API:', fetchError.message);
          }
        }

        const githubId = profile.id;
        const nombreCompleto = profile.displayName || profile.username || 'Usuario GitHub';
        const fotoPerfil = profile.photos?.[0]?.value || `https://avatars.githubusercontent.com/u/${profile.id}`;

        // Dividir nombre completo en nombre y apellido
        const partesNombre = nombreCompleto.split(' ');
        const nombre = partesNombre[0] || 'Usuario';
        const apellido = partesNombre.slice(1).join(' ') || 'GitHub';

        // 🔥 Si aún no hay email, usar el username como fallback
        if (!email) {
          email = `${profile.username}@github.local`;
          console.log('⚠️ Usando email generado como fallback:', email);
        }

        // 1. Buscar si ya existe usuario con este GitHub ID
        let usuarios = await ejecutarConsulta(
          'SELECT * FROM usuarios WHERE github_id = ? LIMIT 1',
          [githubId]
        );

        if (usuarios.length > 0) {
          console.log('✅ Usuario existente encontrado por GitHub ID');
          return done(null, usuarios[0]);
        }

        // 2. Buscar si existe usuario con ese email
        usuarios = await ejecutarConsulta(
          'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
          [email]
        );

        if (usuarios.length > 0) {
          // Vincular cuenta de GitHub a usuario existente
          console.log('🔗 Vinculando cuenta de GitHub a usuario existente');
          await ejecutarConsulta(
            'UPDATE usuarios SET github_id = ?, auth_provider = ?, foto_perfil = ? WHERE id_usuario = ?',
            [githubId, 'github', fotoPerfil, usuarios[0].id_usuario]
          );

          const usuarioActualizado = await ejecutarConsulta(
            'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1',
            [usuarios[0].id_usuario]
          );

          return done(null, usuarioActualizado[0]);
        }

        // 3. Crear nuevo usuario con GitHub
        console.log('➕ Creando nuevo usuario con GitHub OAuth');

        const resultado = await ejecutarConsulta(
          `INSERT INTO usuarios (nombre, apellido, email, github_id, auth_provider, foto_perfil, verificado, rol) 
           VALUES (?, ?, ?, ?, 'github', ?, TRUE, 'cliente')`,
          [nombre, apellido, email, githubId, fotoPerfil]
        );

        const nuevoUsuario = await ejecutarConsulta(
          'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1',
          [resultado.insertId]
        );

        console.log('✅ Usuario creado exitosamente:', nuevoUsuario[0].email);
        return done(null, nuevoUsuario[0]);

      } catch (error) {
        console.error('❌ Error en GitHub OAuth:', error);
        return done(error, null);
      }
    }
  )
);

/**
 * ========================================
 * SERIALIZACIÓN (No usamos sesiones, pero es requerido)
 * ========================================
 */
passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuarios = await ejecutarConsulta(
      'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1',
      [id]
    );
    done(null, usuarios[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import landing from '../../assets/landing-small.jpg';
import { MiniDivider } from '../layout/MiniDivider';
import Particles from 'react-particles-js';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundImage: 'url(' + landing + ')',
    backgroundBlendMode: 'overlay',
    backgroundSize: 'cover',
  },
  particles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  grid: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    '& p, h3': {
      fontFamily: 'Raleway',
      color: 'white',
    },
  },
  iconContainer: {
    borderRadius: '50%',
    backgroundColor: 'white',
    height: isMobile ? 160 : 280,
    width: isMobile ? 160 : 280,
    display: 'flex',
    justifyContent: 'center',
    margin: '20px',
  },

  header: {
    margin: '10px',
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  button: {
    zIndex: 2,
    width: isMobile ? '35%' : '15%',
    margin: '5px',
    color: 'white',
    border: '1px solid white',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.4)',
    },
  },

  dialogAction: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '50px',
    margin: 0,
    padding: 0,
    background:
      'linear-gradient(90deg, rgba(132,94,194,1) 0%, rgba(214,93,177,1) 100%)',
  },
});

const Landing = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Grid
        justify='center'
        alignItems='center'
        className={classes.grid}
        style={{ marginBottom: '20px' }}>
        <Particles
          className={classes.particles}
          params={{
            particles: {
              number: {
                value: isMobile ? 20 : 50,
              },
              size: {
                value: 3,
              },
            },
          }}
        />
        <div className={classes.iconContainer}>
          <img
            src={require('../../assets/logo.png')}
            style={{
              height: isMobile ? 150 : 270,
              width: isMobile ? 150 : 270,
            }}
          />
        </div>
        <Typography variant='h3' className={classes.header}>
          Welcome to SocialCleanr
        </Typography>
        <Typography>connect. check. clean.</Typography>
        <MiniDivider color={'white'} />

        <Link
          to='/auth'
          style={{
            textAlign: 'center',
            width: '100%',
            textDecoration: 'none',
          }}>
          <Button color='primary' size='large ' className={classes.button}>
            Get Started
          </Button>
        </Link>

        <Button
          color='primary'
          size='large '
          className={classes.button}
          onClick={handleClickOpen}>
          Learn More
        </Button>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '20px',
          },
        }}>
        <DialogTitle>
          <Typography variant='h5' style={{ fontFamily: 'raleway' }}>
            ABOUT SOCIALCLEANR
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            SocialCleanr is a social media companion that can automatically scan
            through your Facebook or Twitter accounts, and flag any content the
            app deems ‘unsavoury’ or inappropriate.
            <br /> <br />
            This is achieved via machine learning techniques for classification
            and object detection - alongside social media APIs. Detected content
            will be aggregated and returned to you, where specific images that
            have been flagged can be automatically cleaned by layering on blur
            filters to the necessary regions of the image.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogAction}>
          <Button
            onClick={handleClose}
            className={classes.button}
            style={{ textAlign: 'center' }}>
            Got It!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Landing;

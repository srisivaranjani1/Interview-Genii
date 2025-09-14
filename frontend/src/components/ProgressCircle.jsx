import React from 'react';
import styles from './progressCircle.module.css';

const ProgressCircle = ({ percent, color }) => {
  const circleStyle = {
    background: `conic-gradient(${color} ${percent}%, #ddd 0%)`,
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  };

  return (
    <div className={styles.circleWrapper} style={circleStyle}>
      <span className={styles.circleText}>{percent}%</span>
    </div>
  );
};

export default ProgressCircle;

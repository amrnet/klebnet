import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const STRATIFY_OPTIONS = [
  'Host',
  'Host tissue sampled',
  'Infection',
  'Selected clinical phenotype',
  'Selected by organism trait',
];

const BAR_COLOR = '#2f539f';

export const StratifiedBarChart = () => {
  const [stratifyBy, setStratifyBy] = useState(STRATIFY_OPTIONS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    axios
      .get('/api/getStratifiedCounts', { params: { stratifyBy } })
      .then(res => {
        if (cancelled) return;
        setData(res.data?.data ?? []);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err?.response?.data?.error || err.message);
        setData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stratifyBy]);

  return (
    <Box sx={{ marginTop: 2, padding: 2, borderTop: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography fontSize="16px" fontWeight="500">
          Stratified genome counts
        </Typography>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="stratify-by-label">Stratify by</InputLabel>
          <Select
            labelId="stratify-by-label"
            value={stratifyBy}
            label="Stratify by"
            onChange={e => setStratifyBy(e.target.value)}
          >
            {STRATIFY_OPTIONS.map(opt => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress size={28} sx={{ color: BAR_COLOR }} />
        </Box>
      )}

      {!loading && error && (
        <Typography color="error" fontSize="14px">
          Failed to load: {error}
        </Typography>
      )}

      {!loading && !error && data.length === 0 && (
        <Typography fontSize="14px" color="text.secondary">
          No data for this stratification.
        </Typography>
      )}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={Math.max(280, data.length * 22 + 60)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="label"
              width={220}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <ChartTooltip formatter={value => [`${value} genomes`, 'Count']} />
            <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

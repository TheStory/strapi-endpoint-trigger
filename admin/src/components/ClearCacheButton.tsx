import { useAuth, useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Button } from '@strapi/design-system';
import { ArrowClockwise } from '@strapi/icons';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMatch } from 'react-router-dom';
import styled from 'styled-components';

import { getTranslation } from '../utils/getTranslation';
import en from '../translations/en.json';

const Container = styled.div`
  position: fixed;
  inset-inline-end: 24px;
  bottom: 24px;
  max-width: calc(100vw - 48px);
  /* Below the upload drawer (200), overlays (300) and notifications. */
  z-index: 10;

  button {
    max-width: 100%;
    white-space: normal;
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  }
`;

const CacheAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(false);
  const client = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const message = (key: keyof typeof en) =>
    formatMessage({ id: getTranslation(key), defaultMessage: en[key] });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function trigger() {
    if (pending.current) return;
    pending.current = true;
    setIsLoading(true);

    try {
      const { data } = await client.post<{ success: boolean }>('/strapi-endpoint-trigger/trigger');
      if (data?.success !== true) throw new Error('Cache clearing was not confirmed');
      if (mounted.current) {
        toggleNotification({ type: 'success', message: message('success'), timeout: 5000 });
      }
    } catch {
      if (mounted.current) {
        toggleNotification({ type: 'danger', message: message('error'), blockTransition: true });
      }
    } finally {
      pending.current = false;
      if (mounted.current) setIsLoading(false);
    }
  }

  return (
    <Container>
      <Button
        type="button"
        variant="secondary"
        startIcon={<ArrowClockwise />}
        onClick={trigger}
        disabled={isLoading}
        loading={isLoading}
        aria-busy={isLoading}
      >
        {message(isLoading ? 'loading' : 'button')}
      </Button>
    </Container>
  );
};

const ClearCacheButton = () => {
  const user = useAuth('ClearCacheButton', (state) => state.user);
  const token = useAuth('ClearCacheButton', (state) => state.token);
  const isLoading = useAuth('ClearCacheButton', (state) => state.isLoading);
  const isAuthPage = useMatch('/auth/*');
  const isOnboarding = useMatch('/usecase');

  if (!token || !user || isLoading || isAuthPage || isOnboarding) return null;

  return <CacheAction key={user.id} />;
};

export default ClearCacheButton;

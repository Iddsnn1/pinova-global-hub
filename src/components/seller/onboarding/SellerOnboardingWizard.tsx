    try {
      const existingUser = getAuthenticatedPiUser();
      const user = existingUser || await PiSdkManager.authenticate(
        ['username', 'payments'],
        undefined,
        false
      );

      if (!user?.accessToken || !user.username) {
        setServerSessionReady(false);
        setSubmitError('Pi authentication was not completed. Please authenticate your Pioneer session in Pi Browser and try again.');
        return false;
      }

      // Reuse the server session negotiated from the authenticated Pi user first.
      // Force-refresh is reserved for an actual expired/invalid session; calling it
      // here can trigger a second native authentication cycle in Pi Browser.
      let sessionToken = await ensureServerSession(false);
      if (!sessionToken) {
        sessionToken = await ensureServerSession(true);
      }
      if (!sessionToken) {
        setServerSessionReady(false);
        setSubmitError('Pi authentication succeeded, but the secure server session could not be established. Please try again.');
        return false;
      }

      setServerSessionReady(true);
      return true;
    } catch (err: any) {
      setServerSessionReady(false);
      setSubmitError(err?.message || 'Pi authentication could not be completed. Please try again in Pi Browser.');
      return false;
    } finally {
      setAuthenticatingPioneer(false);
    }
  };